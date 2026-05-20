const { Mother } = require('../models');

/**
 * Generate unique Mother ID
 * Format: MOM-{DISTRICT_CODE}-{YEAR}-{SEQUENTIAL_NUMBER}
 * Example: MOM-CL-26-0001
 */
const generateMotherID = async (district) => {
  try {
    // Get district code (first 2 letters, uppercase)
    const districtCode = district 
      ? district.substring(0, 2).toUpperCase() 
      : 'GN'; // GN = General
    
    // Get current year (last 2 digits)
    const year = new Date().getFullYear().toString().substring(2);
    
    // Count existing mothers with same district code pattern
    const count = await Mother.count({
      where: {
        mother_code: {
          [require('sequelize').Op.like]: `MOM-${districtCode}-${year}-%`
        }
      }
    });
    
    // Generate sequential number (4 digits)
    const sequentialNumber = String(count + 1).padStart(4, '0');
    
    return `MOM-${districtCode}-${year}-${sequentialNumber}`;
  } catch (error) {
    console.error('Error generating mother ID:', error);
    // Fallback: use timestamp
    const timestamp = Date.now().toString().slice(-6);
    return `MOM-GN-${timestamp}`;
  }
};

module.exports = generateMotherID;