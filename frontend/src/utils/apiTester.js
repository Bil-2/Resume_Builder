/**
 * API Testing Utility
 * Comprehensive testing for all API endpoints
 */

import { authAPI, resumeAPI, projectAPI, courseAPI, achievementAPI, skillAPI } from '../services/api';
import toast from 'react-hot-toast';

export class APITester {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
  }

  async testEndpoint(name, testFn) {
    try {
      this.log(`Testing: ${name}`, 'test');
      await testFn();
      this.results.passed.push(name);
      this.log(`✅ PASSED: ${name}`, 'success');
      return true;
    } catch (error) {
      this.results.failed.push({ name, error: error.message });
      this.log(`❌ FAILED: ${name} - ${error.message}`, 'error');
      return false;
    }
  }

  // Auth API Tests
  async testAuthAPI() {
    this.log('=== TESTING AUTH API ===', 'section');
    
    await this.testEndpoint('Auth - Get Profile', async () => {
      const response = await authAPI.getProfile();
      if (!response.data) throw new Error('No data returned');
      if (!response.data.data) throw new Error('No user data in response');
    });
  }

  // Resume API Tests
  async testResumeAPI() {
    this.log('=== TESTING RESUME API ===', 'section');
    
    await this.testEndpoint('Resume - Get All', async () => {
      const response = await resumeAPI.getAll();
      if (!response.data) throw new Error('No data returned');
      if (!Array.isArray(response.data.data)) throw new Error('Data is not an array');
    });
  }

  // Project API Tests
  async testProjectAPI() {
    this.log('=== TESTING PROJECT API ===', 'section');
    
    await this.testEndpoint('Project - Get All', async () => {
      const response = await projectAPI.getAll();
      if (!response.data) throw new Error('No data returned');
      if (!Array.isArray(response.data.data)) throw new Error('Data is not an array');
    });
  }

  // Course API Tests
  async testCourseAPI() {
    this.log('=== TESTING COURSE API ===', 'section');
    
    await this.testEndpoint('Course - Get All', async () => {
      const response = await courseAPI.getAll();
      if (!response.data) throw new Error('No data returned');
      if (!Array.isArray(response.data.data)) throw new Error('Data is not an array');
    });
  }

  // Achievement API Tests
  async testAchievementAPI() {
    this.log('=== TESTING ACHIEVEMENT API ===', 'section');
    
    await this.testEndpoint('Achievement - Get All', async () => {
      const response = await achievementAPI.getAll();
      if (!response.data) throw new Error('No data returned');
      if (!Array.isArray(response.data.data)) throw new Error('Data is not an array');
    });
  }

  // Skill API Tests
  async testSkillAPI() {
    this.log('=== TESTING SKILL API ===', 'section');
    
    await this.testEndpoint('Skill - Get All', async () => {
      const response = await skillAPI.getAll();
      if (!response.data) throw new Error('No data returned');
      if (!Array.isArray(response.data.data)) throw new Error('Data is not an array');
    });

    await this.testEndpoint('Skill - Get Grouped', async () => {
      const response = await skillAPI.getGrouped();
      if (!response.data) throw new Error('No data returned');
    });
  }

  // Run all tests
  async runAllTests() {
    this.log('🚀 STARTING COMPREHENSIVE API TESTS', 'header');
    this.log('=====================================', 'header');
    
    const startTime = Date.now();

    try {
      await this.testAuthAPI();
      await this.testResumeAPI();
      await this.testProjectAPI();
      await this.testCourseAPI();
      await this.testAchievementAPI();
      await this.testSkillAPI();
    } catch (error) {
      this.log(`Critical error during testing: ${error.message}`, 'error');
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    this.printResults(duration);
    return this.results;
  }

  printResults(duration) {
    this.log('', 'divider');
    this.log('=====================================', 'header');
    this.log('📊 TEST RESULTS', 'header');
    this.log('=====================================', 'header');
    this.log(`⏱️  Duration: ${duration}s`, 'info');
    this.log(`✅ Passed: ${this.results.passed.length}`, 'success');
    this.log(`❌ Failed: ${this.results.failed.length}`, 'error');
    this.log(`⚠️  Warnings: ${this.results.warnings.length}`, 'warning');
    
    if (this.results.passed.length > 0) {
      this.log('', 'divider');
      this.log('✅ PASSED TESTS:', 'section');
      this.results.passed.forEach(test => {
        this.log(`  • ${test}`, 'success');
      });
    }

    if (this.results.failed.length > 0) {
      this.log('', 'divider');
      this.log('❌ FAILED TESTS:', 'section');
      this.results.failed.forEach(({ name, error }) => {
        this.log(`  • ${name}: ${error}`, 'error');
      });
    }

    this.log('', 'divider');
    this.log('=====================================', 'header');
    
    const passRate = ((this.results.passed.length / (this.results.passed.length + this.results.failed.length)) * 100).toFixed(1);
    this.log(`📈 Pass Rate: ${passRate}%`, passRate >= 90 ? 'success' : 'warning');
    
    if (passRate === 100) {
      this.log('🎉 ALL TESTS PASSED! APIs are 100% functional!', 'success');
      toast.success('🎉 All APIs working perfectly!');
    } else if (passRate >= 80) {
      this.log('✅ Most tests passed. Some endpoints may need attention.', 'warning');
      toast.success(`✅ ${passRate}% APIs working`);
    } else {
      this.log('⚠️  Multiple failures detected. Please review API configuration.', 'error');
      toast.error('⚠️ Some APIs need attention');
    }
    
    this.log('=====================================', 'header');
  }
}

// Quick test function for console
export async function testAllAPIs() {
  const tester = new APITester();
  return await tester.runAllTests();
}

// Export for easy console access
if (typeof window !== 'undefined') {
  window.testAllAPIs = testAllAPIs;
  console.log('💡 TIP: Run window.testAllAPIs() to test all API endpoints');
}

export default APITester;
