const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname);

// Helper for bulk string replacements
function replaceInFile(filePath, replacements) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
      content = content.split(search).join(replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. AeternaCredentials.tsx
replaceInFile(path.join(baseDir, 'src/components/AeternaCredentials.tsx'), [
  ['Surgical Procedures', 'Clinical Procedures'],
  ['Complex reconstructive & cosmetic operations', 'Complex medical & cosmetic dermatology'],
  ['Non-Surgical Treatments', 'Advanced Skincare'],
  ['Injectables, fillers & skin rejuvenation', 'Lasers, injectables & skin rejuvenation'],
  ['surgical mastery', 'clinical mastery'],
  ['Rhinoplasty & Facial Sculpting', 'Acne Treatment & Scarring'],
  ['Nose reshaping, nasal tip refinement, dorsal hump correction, revision rhinoplasty, and ethnic rhinoplasty with precision surgical techniques', 'Advanced hormonal acne therapy, deep cystic acne treatment, subcision, TCA cross, and laser scar resurfacing'],
  ['Breast Augmentation & Lift', 'Laser Skin Resurfacing'],
  ['Breast implants, breast lift (mastopexy), breast reduction, implant revision, and natural fat transfer augmentation', 'Fraxel dual laser, CO2 fractional resurfacing, IPL photofacial, PicoSure for pigmentation, and non-ablative rejuvenation'],
  ['Body Contouring & Liposuction', 'Botox & Dermal Fillers'],
  ['360° liposuction, tummy tuck (abdominoplasty), Brazilian butt lift, arm lift, thigh lift, and post-weight-loss body sculpting', 'Neuromodulators, Juvederm, Restylane, Sculptra collagen stimulation, under-eye rejuvenation, and liquid facelifts'],
  ['Facelift & Neck Lift', 'Advanced Chemical Peels'],
  ['Deep plane facelift, mini facelift, neck lift (platysmaplasty), SMAS facelift, and thread lift for comprehensive facial rejuvenation', "TCA peels, Vi Peel, Cosmelan depigmentation, Jessner's peel, and customized exfoliation for glowing skin"],
  ['Blepharoplasty & Eye Rejuvenation', 'Microneedling & PRP'],
  ['Upper eyelid surgery, lower eyelid surgery, under-eye fat repositioning, brow lift, and periorbital rejuvenation for a refreshed appearance', 'Collagen induction therapy, radiofrequency microneedling (Morpheus8), and platelet-rich plasma for hair and skin'],
  ['Non-Surgical Injectables & Fillers', 'Skin Cancer Screening'],
  ['Botox, Dysport, hyaluronic acid fillers, Sculptra, Kybella, PRP therapy, and liquid facelift with micro-cannula precision technique', 'Comprehensive full-body mole checks, dermoscopy, biopsy, and precision excision with minimal scarring'],
  ['Plastic Surgery Residency', 'Dermatology Residency'],
  ['Aesthetic Surgery Fellowship', 'Cosmetic Dermatology Fellowship'],
  ['Board Certified Plastic Surgeon', 'Board Certified Dermatologist'],
  ['American Board of Plastic Surgery (ABPS)', 'American Board of Dermatology (ABD)'],
  ['American College of Surgeons', 'American Academy of Dermatology'],
  ['FACS — Surgical Excellence', 'FAAD — Clinical Excellence'],
  ['American Society of Plastic & Aesthetic Surgeons', 'American Society for Dermatologic Surgery'],
  ['ASPS & ASAPS Member', 'ASDS & AAD Member'],
  ['Pre-Surgical State', 'Pre-Treatment State'],
  ['Post-Surgical State', 'Post-Treatment State'],
  ['Surgical', 'Clinical'] // Catch-all for headers like Surgical Excellence
]);

// 2. server.ts
replaceInFile(path.join(baseDir, 'server.ts'), [
  ['Rhinoplasty & Facial Sculpting', 'Acne Treatment & Scarring'],
  ['rhinoplasty', 'acne treatment'],
  ['Rhinoplasty', 'Acne Treatment'],
  ['plastic surgeons', 'dermatologists'],
  ['facelift', 'laser resurfacing'],
  ['Facelift & Neck Lift', 'Laser Skin Resurfacing'],
  ['Deep Plane Facelift', 'CO2 Laser Resurfacing'],
  ['deep plane technique', 'laser technique'],
  ['body contouring surgery', 'chemical peel'],
  ['Body Contouring', 'Chemical Peel'],
  ['breast augmentation', 'microneedling'],
  ['Breast Augmentation', 'Microneedling'],
  ['blepharoplasty', 'botox'],
  ['Blepharoplasty', 'Botox'],
  ['mini facelift and neck lift', 'PRP and filler'],
  ['tummy tuck and liposuction', 'fraxel and IPL'],
  ['surgical precision', 'clinical precision'],
  ['revision rhinoplasty', 'melasma treatment'],
  ['Revision Rhinoplasty', 'Melasma Treatment'],
  ['previous surgery', 'previous treatment'],
  ['AI Surgical Consultation Companion', 'AI Dermatology Consultation Companion'],
  ['plastic surgery procedures', 'dermatology procedures'],
  ['Surgical Reservations', 'Clinical Reservations'],
  ['surgical approach', 'clinical approach'],
  ['1. Rhinoplasty & Facial Sculpting (nose reshaping, dorsal hump correction, tip refinement, revision rhinoplasty).', '1. Acne Treatment & Scarring (hormonal acne, cystic acne, subcision, laser scar resurfacing).'],
  ['2. Breast Augmentation & Lift (implant types, natural fat transfer, mastopexy, implant sizing).', '2. Laser Skin Resurfacing (Fraxel, CO2 fractional, IPL, PicoSure).'],
  ['3. Body Contouring & Liposuction (360° lipo, tummy tuck, BBL, arm/thigh lift, post-weight-loss surgery).', '3. Botox & Dermal Fillers (Neuromodulators, Juvederm, Restylane, Sculptra).'],
  ['4. Facelift & Neck Lift (deep plane, SMAS, mini facelift, platysmaplasty, thread lift).', "4. Advanced Chemical Peels (TCA, Vi Peel, Cosmelan, Jessner's)."],
  ['5. Blepharoplasty & Eye Rejuvenation (upper/lower eyelid surgery, brow lift).', '5. Microneedling & PRP (Collagen induction, Morpheus8, platelet-rich plasma).'],
  ['6. Non-Surgical Injectables (Botox, fillers, Sculptra, Kybella, PRP, liquid facelift).', '6. Skin Cancer Screening (mole checks, dermoscopy, biopsy, excision).'],
  ['Virtual Surgical Advisor', 'Virtual Dermatology Advisor']
]);

// 3. AeternaBeforeAfter.tsx
replaceInFile(path.join(baseDir, 'src/components/AeternaBeforeAfter.tsx'), [
  ['Surgical Case 01', 'Clinical Case 01'],
  ['Revision Rhinoplasty', 'Severe Acne Clearance'],
  ['Dorsal hump reduction and tip refinement', 'Hormonal acne treatment and scar revision'],
  ['Surgical Case 02', 'Clinical Case 02'],
  ['Deep Plane Facelift', 'Laser Skin Resurfacing'],
  ['Comprehensive lower face and neck rejuvenation', 'CO2 fractional laser for sun damage and wrinkles'],
  ['Surgical Case 03', 'Clinical Case 03'],
  ['Body Contouring', 'Melasma Treatment'],
  ['360° liposuction with natural enhancement', 'Cosmelan depigmentation and chemical peels'],
  ['Surgical Case 04', 'Clinical Case 04'],
  ['Blepharoplasty', 'Under-Eye Rejuvenation'],
  ['Upper and lower eyelid rejuvenation', 'Tear trough filler and PRP therapy'],
  ['surgical intervention', 'clinical treatment'],
  ['Post-Op', 'Post-Treatment']
]);

// 4. AeternaVirtualConsultant.tsx
replaceInFile(path.join(baseDir, 'src/components/AeternaVirtualConsultant.tsx'), [
  ['Virtual Surgical Assistant', 'Virtual Dermatology Assistant'],
  ['surgical advice', 'dermatological advice'],
  ['surgical journey', 'skincare journey']
]);

// 5. AeternaHero.tsx & AeternaBookingModal.tsx & App.tsx
const appFiles = [
  'src/components/AeternaHero.tsx',
  'src/components/AeternaBookingModal.tsx',
  'src/App.tsx'
];
appFiles.forEach(file => {
  replaceInFile(path.join(baseDir, file), [
    ['plastic surgeon specializing in rhinoplasty, facial rejuvenation, body contouring, and aesthetic excellence', 'dermatologist specializing in medical, surgical, and cosmetic skincare excellence'],
    ['Plastic Surgeon', 'Dermatologist'],
    ['Surgical Reservations', 'Clinical Reservations'],
    ['surgical consultation', 'dermatology consultation'],
    ['Surgical Consultation', 'Dermatology Consultation'],
    ['plastic surgery', 'dermatology'],
    ['Surgical', 'Clinical'],
    ['surgical', 'clinical'],
    ['Surgery', 'Dermatology'],
    ['surgeon', 'dermatologist']
  ]);
});

console.log("Done.");
