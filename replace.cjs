const fs = require('fs');
const path = require('path');

const files = [
  'src/components/AeternaBookingModal.tsx',
  'src/components/AeternaClinicExperience.tsx',
  'src/components/AeternaFooter.tsx',
  'src/components/AeternaHeader.tsx',
  'src/components/AeternaHero.tsx',
  'src/components/AeternaTestimonials.tsx',
  'src/components/AeternaVirtualConsultant.tsx',
  'server.ts',
  'index.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace names
    content = content.replace(/Dr\. Victor Ashford/g, 'Dr. Naveen Keshwani');
    content = content.replace(/Victor Ashford/g, 'Brite');
    content = content.replace(/Dr\. Ashford/g, 'Dr. Naveen Keshwani');
    content = content.replace(/Ashford/g, 'Brite');
    
    // Replace clinic name
    content = content.replace(/Aureum Aesthetics/g, 'Brite Clinic');
    content = content.replace(/Aureum/g, 'Brite');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
