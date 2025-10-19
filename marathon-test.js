#!/usr/bin/env node

/**
 * 🏃 MARATHON TEST - 30 MINUTES CONTINUOUS TESTING
 * Tests EVERYTHING over and over and over again
 */

import axios from 'axios';
import { performance } from 'perf_hooks';

const API_BASE = 'http://localhost:5001/api';
const FRONTEND_URL = 'http://localhost:3000';
const TEST_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CYCLE_DELAY = 2000; // 2 seconds between cycles

// Statistics
const stats = {
  cyclesCompleted: 0,
  totalTests: 0,
  passed: 0,
  failed: 0,
  errors: [],
  startTime: Date.now(),
  requestsPerSecond: [],
  responseTimes: []
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(msg, color = colors.reset) {
  const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  console.log(`${color}[${mins}:${secs.toString().padStart(2, '0')}] ${msg}${colors.reset}`);
}

function getTimeRemaining() {
  const elapsed = Date.now() - stats.startTime;
  const remaining = TEST_DURATION_MS - elapsed;
  const mins = Math.floor(remaining / 1000 / 60);
  const secs = Math.floor((remaining / 1000) % 60);
  return `${mins}m ${secs}s`;
}

async function testAPI(name, testFn) {
  stats.totalTests++;
  const start = performance.now();
  
  try {
    await testFn();
    const time = performance.now() - start;
    stats.passed++;
    stats.responseTimes.push(time);
    return { success: true, time };
  } catch (error) {
    stats.failed++;
    const errorMsg = `${name}: ${error.message}`;
    if (!stats.errors.find(e => e.test === name)) {
      stats.errors.push({ test: name, message: error.message, cycle: stats.cyclesCompleted });
    }
    log(`❌ ${errorMsg}`, colors.red);
    return { success: false, error: error.message };
  }
}

async function runTestCycle() {
  stats.cyclesCompleted++;
  const cycleStart = performance.now();
  
  log(`\n${'='.repeat(70)}`, colors.cyan);
  log(`🔄 CYCLE ${stats.cyclesCompleted} - Time Remaining: ${getTimeRemaining()}`, colors.magenta);
  log('='.repeat(70), colors.cyan);
  
  let token = '';
  let userId = '';
  const timestamp = Date.now();
  
  // 1. Infrastructure Check
  log('🔍 Testing Infrastructure...', colors.yellow);
  await testAPI('Frontend Health', async () => {
    const res = await axios.get(FRONTEND_URL, { timeout: 5000 });
    if (res.status !== 200) throw new Error('Frontend not responding');
  });
  
  await testAPI('Backend Health', async () => {
    const res = await axios.get(`${API_BASE}/../health`, { timeout: 5000 });
    if (res.status !== 200 || !res.data.success) throw new Error('Backend unhealthy');
  });
  
  // 2. Authentication Flow
  log('🔐 Testing Authentication...', colors.yellow);
  await testAPI('Register User', async () => {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      firstName: 'Marathon',
      lastName: 'Test',
      email: `test${timestamp}@test.com`,
      password: 'password123'
    });
    if (!res.data.success || !res.data.data.token) throw new Error('Registration failed');
    token = res.data.data.token;
    userId = res.data.data.user._id;
  });
  
  await testAPI('Login User', async () => {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: `test${timestamp}@test.com`,
      password: 'password123'
    });
    if (!res.data.success) throw new Error('Login failed');
  });
  
  await testAPI('Get Current User', async () => {
    const res = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success || res.data.data._id !== userId) throw new Error('Get user failed');
  });
  
  await testAPI('Update Profile', async () => {
    const res = await axios.put(`${API_BASE}/auth/profile`, {
      phone: '+1234567890'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Profile update failed');
  });
  
  // 3. Resume Operations
  log('📄 Testing Resume APIs...', colors.yellow);
  let resumeId;
  
  await testAPI('Create Resume', async () => {
    const res = await axios.post(`${API_BASE}/resumes`, {
      title: `Resume ${timestamp}`,
      template: 'modern',
      personalInfo: {
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '+1234567890'
      },
      summary: 'Experienced developer',
      experience: [{
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01',
        endDate: '2024-01',
        description: 'Developed applications'
      }],
      education: [{
        institution: 'University',
        degree: 'BS Computer Science',
        startDate: '2016-09',
        endDate: '2020-05'
      }]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Resume creation failed');
    resumeId = res.data.data._id;
  });
  
  await testAPI('Get All Resumes', async () => {
    const res = await axios.get(`${API_BASE}/resumes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Get resumes failed');
  });
  
  await testAPI('Get Single Resume', async () => {
    const res = await axios.get(`${API_BASE}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success || res.data.data._id !== resumeId) throw new Error('Get resume failed');
  });
  
  await testAPI('Update Resume', async () => {
    const res = await axios.put(`${API_BASE}/resumes/${resumeId}`, {
      title: `Updated Resume ${timestamp}`
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Resume update failed');
  });
  
  await testAPI('Duplicate Resume', async () => {
    const res = await axios.post(`${API_BASE}/resumes/${resumeId}/duplicate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Resume duplication failed');
    // Delete the duplicate
    await axios.delete(`${API_BASE}/resumes/${res.data.data._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  });
  
  // 4. Project Operations
  log('💼 Testing Project APIs...', colors.yellow);
  let projectId;
  
  await testAPI('Create Project', async () => {
    const res = await axios.post(`${API_BASE}/projects`, {
      title: `Project ${timestamp}`,
      description: 'Test project description with details',
      category: 'web',
      technologies: ['React', 'Node.js', 'MongoDB'],
      role: 'Full Stack Developer',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      status: 'completed',
      links: {
        github: 'https://github.com/test/project',
        live: 'https://example.com'
      }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Project creation failed');
    projectId = res.data.data._id;
  });
  
  await testAPI('Get All Projects', async () => {
    const res = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Get projects failed');
  });
  
  await testAPI('Get Single Project', async () => {
    const res = await axios.get(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Get project failed');
  });
  
  await testAPI('Update Project', async () => {
    const res = await axios.put(`${API_BASE}/projects/${projectId}`, {
      title: `Updated Project ${timestamp}`
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Project update failed');
  });
  
  // 5. Course Operations
  log('📚 Testing Course APIs...', colors.yellow);
  let courseId;
  
  await testAPI('Create Course', async () => {
    const res = await axios.post(`${API_BASE}/courses`, {
      courseName: `Course ${timestamp}`,
      institution: 'Test University',
      platform: 'udemy',
      category: 'programming',
      instructor: 'John Doe',
      startDate: '2024-01-01',
      status: 'in-progress',
      progress: 50
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Course creation failed');
    courseId = res.data.data._id;
  });
  
  await testAPI('Get All Courses', async () => {
    const res = await axios.get(`${API_BASE}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Get courses failed');
  });
  
  await testAPI('Update Course Progress', async () => {
    const res = await axios.patch(`${API_BASE}/courses/${courseId}/progress`, {
      progress: 75
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Progress update failed');
  });
  
  await testAPI('Update Course', async () => {
    const res = await axios.put(`${API_BASE}/courses/${courseId}`, {
      courseName: `Updated Course ${timestamp}`
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Course update failed');
  });
  
  // 6. Skill Operations
  log('💪 Testing Skill APIs...', colors.yellow);
  let skillId;
  
  await testAPI('Create Skill', async () => {
    const res = await axios.post(`${API_BASE}/skills`, {
      name: `Skill-${timestamp}`,
      category: 'programming-languages',
      proficiency: 'advanced',
      yearsOfExperience: 3
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Skill creation failed');
    skillId = res.data.data._id;
  });
  
  await testAPI('Get All Skills', async () => {
    const res = await axios.get(`${API_BASE}/skills`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Get skills failed');
  });
  
  await testAPI('Get Grouped Skills', async () => {
    const res = await axios.get(`${API_BASE}/skills/grouped`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Get grouped skills failed');
  });
  
  await testAPI('Update Skill', async () => {
    const res = await axios.put(`${API_BASE}/skills/${skillId}`, {
      proficiency: 'expert'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Skill update failed');
  });
  
  // 7. Achievement Operations
  log('🏆 Testing Achievement APIs...', colors.yellow);
  let achievementId;
  
  await testAPI('Create Achievement', async () => {
    const res = await axios.post(`${API_BASE}/achievements`, {
      title: `Award ${timestamp}`,
      issuer: 'Test Organization',
      date: '2024-01-01',
      description: 'Test achievement description',
      category: 'award'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Achievement creation failed');
    achievementId = res.data.data._id;
  });
  
  await testAPI('Get All Achievements', async () => {
    const res = await axios.get(`${API_BASE}/achievements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Get achievements failed');
  });
  
  await testAPI('Update Achievement', async () => {
    const res = await axios.put(`${API_BASE}/achievements/${achievementId}`, {
      title: `Updated Award ${timestamp}`
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Achievement update failed');
  });
  
  // 8. Concurrent Load Test
  log('🔥 Testing Concurrent Load...', colors.yellow);
  await testAPI('50 Concurrent Requests', async () => {
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
    }
    const results = await Promise.all(promises);
    if (!results.every(r => r.data.success)) throw new Error('Some concurrent requests failed');
  });
  
  // 9. Error Handling Test
  log('⚠️  Testing Error Handling...', colors.yellow);
  await testAPI('Unauthorized Access', async () => {
    try {
      await axios.get(`${API_BASE}/resumes`);
      throw new Error('Should have been unauthorized');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return; // Expected
      }
      throw error;
    }
  });
  
  await testAPI('Invalid Endpoint', async () => {
    try {
      await axios.get(`${API_BASE}/nonexistent`);
      throw new Error('Should have been 404');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return; // Expected
      }
      throw error;
    }
  });
  
  // 10. Cleanup
  log('🧹 Cleaning up test data...', colors.yellow);
  await testAPI('Delete Achievement', async () => {
    const res = await axios.delete(`${API_BASE}/achievements/${achievementId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Delete achievement failed');
  });
  
  await testAPI('Delete Skill', async () => {
    const res = await axios.delete(`${API_BASE}/skills/${skillId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Delete skill failed');
  });
  
  await testAPI('Delete Course', async () => {
    const res = await axios.delete(`${API_BASE}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Delete course failed');
  });
  
  await testAPI('Delete Project', async () => {
    const res = await axios.delete(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Delete project failed');
  });
  
  await testAPI('Delete Resume', async () => {
    const res = await axios.delete(`${API_BASE}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Delete resume failed');
  });
  
  const cycleTime = Math.round(performance.now() - cycleStart);
  const reqPerSec = Math.round(34 / (cycleTime / 1000)); // 34 tests per cycle
  stats.requestsPerSecond.push(reqPerSec);
  
  log(`✅ Cycle ${stats.cyclesCompleted} Complete - ${cycleTime}ms (${reqPerSec} req/s)`, colors.green);
  
  // Print current stats
  const successRate = ((stats.passed / stats.totalTests) * 100).toFixed(2);
  const avgResponseTime = stats.responseTimes.length > 0 
    ? Math.round(stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length) 
    : 0;
  
  log(`📊 Stats: ${stats.passed}/${stats.totalTests} passed (${successRate}%) | Avg: ${avgResponseTime}ms`, colors.cyan);
  
  if (stats.errors.length > 0) {
    log(`⚠️  Unique Errors: ${stats.errors.length}`, colors.red);
  }
}

async function runMarathonTest() {
  console.clear();
  log('🏃 MARATHON TEST - 30 MINUTES CONTINUOUS TESTING', colors.magenta);
  log('Testing EVERYTHING over and over and over again...', colors.yellow);
  log(`Start Time: ${new Date().toLocaleTimeString()}`, colors.cyan);
  log('='.repeat(70), colors.cyan);
  
  const endTime = Date.now() + TEST_DURATION_MS;
  
  while (Date.now() < endTime) {
    try {
      await runTestCycle();
      
      // Wait between cycles
      await new Promise(resolve => setTimeout(resolve, CYCLE_DELAY));
      
    } catch (error) {
      log(`❌ Cycle error: ${error.message}`, colors.red);
    }
  }
  
  // Final Report
  console.log('\n' + '='.repeat(70));
  log('🏁 MARATHON TEST COMPLETE', colors.magenta);
  console.log('='.repeat(70));
  
  const totalTime = Math.round((Date.now() - stats.startTime) / 1000);
  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;
  const successRate = ((stats.passed / stats.totalTests) * 100).toFixed(2);
  const avgResponseTime = stats.responseTimes.length > 0 
    ? Math.round(stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length) 
    : 0;
  const avgReqPerSec = stats.requestsPerSecond.length > 0
    ? Math.round(stats.requestsPerSecond.reduce((a, b) => a + b, 0) / stats.requestsPerSecond.length)
    : 0;
  
  log(`\n📊 FINAL STATISTICS`, colors.cyan);
  log(`Duration: ${mins}m ${secs}s`, colors.yellow);
  log(`Cycles Completed: ${stats.cyclesCompleted}`, colors.yellow);
  log(`Total Tests: ${stats.totalTests}`, colors.yellow);
  log(`✅ Passed: ${stats.passed}`, colors.green);
  log(`❌ Failed: ${stats.failed}`, colors.red);
  log(`Success Rate: ${successRate}%`, successRate === '100.00' ? colors.green : colors.yellow);
  log(`Average Response Time: ${avgResponseTime}ms`, colors.cyan);
  log(`Average Throughput: ${avgReqPerSec} req/s`, colors.cyan);
  log(`Total API Calls: ${stats.passed + stats.failed}`, colors.cyan);
  
  if (stats.errors.length > 0) {
    log(`\n⚠️  ERRORS FOUND (${stats.errors.length} unique):`, colors.red);
    stats.errors.forEach(err => {
      log(`   - ${err.test}: ${err.message} (Cycle ${err.cycle})`, colors.red);
    });
  } else {
    log(`\n🎉 PERFECT! NO ERRORS IN ${stats.cyclesCompleted} CYCLES!`, colors.green);
  }
  
  console.log('\n' + '='.repeat(70));
  
  if (stats.failed === 0) {
    log('✅ SYSTEM IS 100% STABLE - READY FOR DEPLOYMENT!', colors.green);
  } else {
    log('⚠️  SOME ISSUES FOUND - REVIEW ERRORS ABOVE', colors.yellow);
  }
  
  log(`End Time: ${new Date().toLocaleTimeString()}\n`, colors.cyan);
}

// Run the marathon
runMarathonTest().catch(error => {
  console.error(`❌ Marathon test crashed: ${error.message}`);
  process.exit(1);
});
