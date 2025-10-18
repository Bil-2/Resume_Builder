import { create } from 'zustand';

const useResumeStore = create((set) => ({
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,

  setResumes: (resumes) => set({ resumes }),
  
  setCurrentResume: (resume) => set({ currentResume: resume }),
  
  addResume: (resume) => set((state) => ({
    resumes: [resume, ...state.resumes]
  })),
  
  updateResume: (id, updatedData) => set((state) => ({
    resumes: state.resumes.map((resume) =>
      resume._id === id ? { ...resume, ...updatedData } : resume
    ),
    currentResume: state.currentResume?._id === id 
      ? { ...state.currentResume, ...updatedData }
      : state.currentResume
  })),
  
  deleteResume: (id) => set((state) => ({
    resumes: state.resumes.filter((resume) => resume._id !== id),
    currentResume: state.currentResume?._id === id ? null : state.currentResume
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));

export default useResumeStore;
