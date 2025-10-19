#!/bin/bash

# Monitor the marathon test progress
clear
echo "🏃 MARATHON TEST - LIVE MONITORING"
echo "=================================="
echo ""
echo "⏱️  Duration: 30 minutes"
echo "🔄 Testing: ALL 34 APIs continuously"
echo "📊 Tests per cycle: 34 tests"
echo ""
echo "Monitoring... Press Ctrl+C to stop monitoring (test continues)"
echo ""
echo "=================================="
echo ""

# Follow the marathon test output
tail -f /dev/null 2>/dev/null || while true; do
    clear
    echo "🏃 MARATHON TEST - LIVE STATUS"
    echo "=================================="
    echo ""
    
    # Get process status
    if pgrep -f "marathon-test.js" > /dev/null; then
        echo "✅ Marathon test is RUNNING"
    else
        echo "❌ Marathon test is NOT running"
    fi
    
    echo ""
    echo "Recent activity:"
    echo "----------------"
    
    # Show service status
    echo ""
    echo "Services:"
    lsof -i :27017 -i :5001 -i :3000 2>/dev/null | grep LISTEN | wc -l | xargs echo "  Running services:"
    
    echo ""
    echo "Press Ctrl+C to stop monitoring"
    echo "=================================="
    
    sleep 5
done
