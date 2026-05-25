// backend/utils/generateMotherID.js
const { Mother } = require('../models');
const { sequelize } = require('../config/db');

const generateMotherID = async () => {
  let isUnique = false;
  let motherCode = null;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    try {
      // Get the current year
      const year = new Date().getFullYear();
      const yearShort = year.toString().slice(-2);
      
      // Get the count of mothers registered this year
      const count = await Mother.count({
        where: sequelize.where(
          sequelize.fn('YEAR', sequelize.col('registered_date')),
          year
        )
      });
      
      // Generate sequential number (starting from 1)
      const sequentialNumber = (count + 1 + attempts).toString().padStart(4, '0');
      
      // Generate mother code format: MOM-YY-XXXX
      // Example: MOM-25-0001, MOM-25-0002
      motherCode = `MOM-${yearShort}-${sequentialNumber}`;
      
      // Check if code already exists
      const existing = await Mother.findOne({ 
        where: { mother_code: motherCode } 
      });
      
      if (!existing) {
        isUnique = true;
      } else {
        console.log(`Duplicate mother code: ${motherCode}, retrying...`);
      }
    } catch (error) {
      console.error('Error generating mother code:', error);
      // Fallback to timestamp-based code
      const timestamp = Date.now().toString().slice(-6);
      motherCode = `MOM-${timestamp}`;
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    // Final fallback using timestamp and random numbers
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    motherCode = `MOM-${timestamp}-${random}`;
  }

  return motherCode;
};

module.exports = generateMotherID;