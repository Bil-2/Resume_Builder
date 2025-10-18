import { useEffect, useRef, useState, useCallback } from 'react';
import { debounce } from '../utils/apiHelpers';
import toast from 'react-hot-toast';

/**
 * Custom hook for auto-saving data
 * @param {Function} saveFunction - Function to call for saving
 * @param {any} data - Data to save
 * @param {number} delay - Debounce delay in milliseconds (default: 2000)
 * @param {Object} options - Additional options
 * @returns {Object} - Auto-save status and controls
 */
const useAutoSave = (saveFunction, data, delay = 2000, options = {}) => {
  const {
    enabled = true,
    onSuccess,
    onError,
    showToast = true,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
  const previousDataRef = useRef(data);
  const saveTimeoutRef = useRef(null);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (dataToSave) => {
      if (!enabled) return;

      try {
        setIsSaving(true);
        setSaveStatus('saving');

        await saveFunction(dataToSave);

        setLastSaved(new Date());
        setSaveStatus('saved');
        
        if (showToast) {
          toast.success('Changes saved', { duration: 2000 });
        }

        if (onSuccess) {
          onSuccess(dataToSave);
        }

        // Reset status after 3 seconds
        saveTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);

      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
        
        if (showToast) {
          toast.error('Failed to save changes');
        }

        if (onError) {
          onError(error);
        }
      } finally {
        setIsSaving(false);
      }
    }, delay),
    [saveFunction, delay, enabled, showToast, onSuccess, onError]
  );

  // Effect to trigger auto-save when data changes
  useEffect(() => {
    if (!enabled) return;

    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    // Skip if data is empty or null
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return;
    }

    previousDataRef.current = data;
    debouncedSave(data);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, debouncedSave, enabled]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (!enabled || !data) return;

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      await saveFunction(data);

      setLastSaved(new Date());
      setSaveStatus('saved');
      
      if (showToast) {
        toast.success('Saved successfully');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Manual save error:', error);
      setSaveStatus('error');
      
      if (showToast) {
        toast.error('Failed to save');
      }

      if (onError) {
        onError(error);
      }
    } finally {
      setIsSaving(false);
    }
  }, [data, saveFunction, enabled, showToast, onSuccess, onError]);

  // Format last saved time
  const getLastSavedText = useCallback(() => {
    if (!lastSaved) return null;

    const now = new Date();
    const diffMs = now - lastSaved;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    return lastSaved.toLocaleTimeString();
  }, [lastSaved]);

  return {
    isSaving,
    lastSaved,
    saveStatus,
    lastSavedText: getLastSavedText(),
    saveNow,
  };
};

export default useAutoSave;
