// Age Verification Utility Functions

/**
 * Check if user has verified their age
 * @returns {boolean} True if age is verified, false otherwise
 */
export const isAgeVerified = () => {
  return localStorage.getItem('ageVerified') === 'true';
};

/**
 * Set age verification status
 * @param {boolean} verified - Whether the user is verified
 */
export const setAgeVerified = (verified = true) => {
  localStorage.setItem('ageVerified', verified.toString());
  
  // Dispatch custom event for same-tab listeners
  window.dispatchEvent(new CustomEvent('ageVerificationChanged', {
    detail: { verified }
  }));
};

/**
 * Clear age verification (useful for testing or logout)
 */
export const clearAgeVerification = () => {
  localStorage.removeItem('ageVerified');
};

/**
 * Force age verification (useful for testing)
 */
export const forceAgeVerification = () => {
  clearAgeVerification();
  // Reload the page to trigger age verification
  window.location.reload();
};

// For testing purposes - add to window object in development
if (process.env.NODE_ENV === 'development') {
  window.clearAgeVerification = clearAgeVerification;
  window.forceAgeVerification = forceAgeVerification;
  window.setAgeVerified = setAgeVerified;
}
