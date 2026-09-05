import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import qrcodeImg from "qrcode";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

dotenv.config();

// Prevent Node.js from crashing due to unhandled promise rejections (e.g. MongoDB timeouts)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/methi-clinic";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

const app = express();
const PORT = Number(process.env.PORT) || 3008;

app.use(express.json());

// In-memory appointments list
let appointments = [
  {
    id: "booking-1",
    name: "Victoria Sterling",
    email: "victoria@example.com",
    phone: "(212) 555-4321",
    concern: "Acne Treatment & Scarring",
    date: "2026-07-15",
    time: "10:30",
    notes: "Interested in dorsal hump correction and tip refinement.",
    status: "confirmed",
    createdAt: new Date().toISOString()
  }
];

// In-memory reviews list to store user submitted feedback
let reviews = [
  {
    id: "rev-1",
    author: "Sophia Delacroix",
    role: "Fashion Editor, Upper East Side",
    rating: 5,
    text: "Dr. Vanita Methi's acne treatment was nothing short of miraculous. My profile is now perfectly balanced, and the recovery was far smoother than I anticipated. His artistry is unmatched.",
    treatment: "Acne Treatment",
    date: "2026-05-12"
  },
  {
    id: "rev-2",
    author: "Alexandra Whitmore",
    role: "Attorney, Tribeca",
    rating: 5,
    text: "I researched dermatologists for two years before choosing Dr. Vanita Methi for my laser resurfacing. The results are stunning — I look refreshed and natural, never overdone. His laser technique is masterful.",
    treatment: "CO2 Laser Resurfacing",
    date: "2026-06-01"
  },
  {
    id: "rev-3",
    author: "Julian Blackwood",
    role: "Architect, Brooklyn Heights",
    rating: 5,
    text: "After significant weight loss, Dr. Vanita Methi performed my chemical peel. The precision and attention to detail were extraordinary. I finally feel confident in my own skin.",
    treatment: "Chemical Peel",
    date: "2026-06-10"
  },
  {
    id: "rev-4",
    author: "Genevieve Laurent",
    role: "Gallery Director, Chelsea",
    rating: 5,
    text: "My microneedling results are incredibly natural-looking. Dr. Vanita Methi took the time to understand exactly what I wanted and delivered beyond my expectations. Absolute perfection.",
    treatment: "Microneedling",
    date: "2026-06-15"
  },
  {
    id: "rev-5",
    author: "Dr. Marcus Thorne",
    role: "Cardiologist, Central Park West",
    rating: 5,
    text: "As a fellow physician, I appreciate Dr. Vanita Methi's evidence-based clinical approach. His botox work on my wife was technically flawless — she looks 15 years younger.",
    treatment: "Botox",
    date: "2026-06-20"
  },
  {
    id: "rev-6",
    author: "Penelope Kensington",
    role: "CEO, Soho",
    rating: 5,
    text: "The Methi experience from consultation to recovery was impeccable. My mini laser resurfacing and neck lift results are so natural that people just say I look 'well-rested.' That's the mark of a true artist.",
    treatment: "Laser Skin Resurfacing",
    date: "2026-06-22"
  },
  {
    id: "rev-7",
    author: "Oliver Harrington",
    role: "Tech Founder, West Village",
    rating: 5,
    text: "I was nervous about getting a acne treatment as a man, but Dr. Vanita Methi understood exactly what masculine refinement means. The result is subtle but transformative — my confidence has skyrocketed.",
    treatment: "Acne Treatment",
    date: "2026-06-25"
  },
  {
    id: "rev-8",
    author: "Beatrice Fontaine",
    role: "Opera Singer, Carnegie Hill",
    rating: 5,
    text: "After my fraxel and IPL with Dr. Vanita Methi, my body looks better than it did in my twenties. The clinical precision and his post-op care team are world-class.",
    treatment: "Chemical Peel",
    date: "2026-06-28"
  },
  {
    id: "rev-9",
    author: "Charlotte Beaumont",
    role: "Writer, Greenwich Village",
    rating: 5,
    text: "Dr. Vanita Methi's non-surgical injectable work is pure artistry. The Botox and filler combination he designed for me eliminated years from my appearance while keeping every expression natural.",
    treatment: "Non-Surgical Injectables",
    date: "2026-07-01"
  },
  {
    id: "rev-10",
    author: "Harrison Caldwell",
    role: "Real Estate Developer, Tribeca",
    rating: 5,
    text: "The revision acne treatment Dr. Vanita Methi performed corrected years of breathing difficulties and aesthetic concerns from a previous treatment. His technical skill is simply on another level.",
    treatment: "Revision Acne Treatment",
    date: "2026-07-03"
  }
];

// =============================================================================
// Authentication & Security
// =============================================================================
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_me_in_production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Missing token." });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
  }
};

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid password." });
});

// =============================================================================
// Legacy API Endpoints (Keeping in-memory for backwards compatibility of old bookings/reviews)
// =============================================================================
app.get("/api/bookings", (req, res) => {
  res.json(appointments);
});

app.post("/api/bookings", (req, res) => {
  const { name, email, phone, concern, date, time, notes } = req.body;
  if (!name || !email || !phone || !concern || !date || !time) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  const newBooking = {
    id: `booking-${Date.now()}`,
    name,
    email,
    phone,
    concern,
    date,
    time,
    notes: notes || "",
    status: "confirmed" as const,
    createdAt: new Date().toISOString()
  };

  appointments.push(newBooking);
  res.status(201).json(newBooking);
});

app.post("/api/bookings/:id/cancel", (req, res) => {
  const { id } = req.params;
  const booking = appointments.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found." });
  }
  booking.status = "cancelled";
  res.json(booking);
});

app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

app.post("/api/reviews", (req, res) => {
  const { author, role, rating, text, treatment } = req.body;
  if (!author || !text || !treatment) {
    return res.status(400).json({ error: "Missing required review fields." });
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    author,
    role: role || "Verified Patient",
    rating: Number(rating) || 5,
    text,
    treatment,
    date: new Date().toISOString().split('T')[0]
  };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

// =============================================================================
// WhatsApp Appointment System — MONGODB DATA
// =============================================================================

// Mongoose Schemas
const waAppointmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  doctor: String,
  patientName: String,
  patientPhone: String,
  date: String,
  time: String,
  status: { type: String, enum: ['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed'], default: 'pending' },
  source: { type: String, default: 'whatsapp' },
  notes: String,
  whatsappChatId: String,
}, { timestamps: true });
const WAAppointmentModel = mongoose.model('WAAppointment', waAppointmentSchema);

const availabilitySchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,
  active: Boolean
});
const AvailabilityModel = mongoose.model('Availability', availabilitySchema);

const blockedDateSchema = new mongoose.Schema({
  date: String,
  reason: String
});
const BlockedDateModel = mongoose.model('BlockedDate', blockedDateSchema);

// Seed default availability if none exists
async function seedAvailability() {
  try {
    const count = await AvailabilityModel.countDocuments();
    if (count === 0) {
      const defaultAvailability = [
        { day: "monday",    startTime: "10:00", endTime: "13:00", active: true },
        { day: "monday",    startTime: "17:00", endTime: "20:00", active: true },
        { day: "tuesday",   startTime: "10:00", endTime: "14:00", active: true },
        { day: "tuesday",   startTime: "16:30", endTime: "19:30", active: true },
        { day: "wednesday", startTime: "17:00", endTime: "20:00", active: true },
        { day: "thursday",  startTime: "10:00", endTime: "13:00", active: true },
        { day: "thursday",  startTime: "17:00", endTime: "20:00", active: true },
        { day: "friday",    startTime: "10:00", endTime: "14:00", active: true },
        { day: "friday",    startTime: "16:30", endTime: "19:00", active: true },
        { day: "saturday",  startTime: "10:00", endTime: "13:00", active: true },
      ];
      await AvailabilityModel.insertMany(defaultAvailability);
      console.log("✅ Seeded default availability schedule.");
    }
  } catch (err) {
    console.error("Failed to seed availability:", err);
  }
}
seedAvailability();

// =============================================================================
// WhatsApp Bot Integration
// =============================================================================
import fs from 'fs';
const pendingNames: Record<string, string> = {};
let whatsappClient: any | null = null;
let waStatus: 'disconnected' | 'initializing' | 'qr_ready' | 'connected' | 'auth_failure' = 'disconnected';
let waQrUrl: string | null = null;

function setupWhatsAppBot() {
  try {
    waStatus = 'initializing';
    waQrUrl = null;
    
    // Attempt to use system Chrome if installed, falling back to Puppeteer's downloaded version
    const winChromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    let execPath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (!execPath && fs.existsSync(winChromePath)) {
      execPath = winChromePath;
    }
    
    whatsappClient = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { 
        executablePath: execPath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] 
      }
    });

    whatsappClient.on('qr', async (qr) => {
      console.log('Generating QR code image...');
      waStatus = 'qr_ready';
      try {
        waQrUrl = await qrcodeImg.toDataURL(qr);
        if (!fs.existsSync('./public')) {
          fs.mkdirSync('./public', { recursive: true });
        }
        await qrcodeImg.toFile('./public/whatsapp-qr.png', qr);
        console.log('✅ QR Code saved to public/whatsapp-qr.png! You can view it at /whatsapp-qr.png');
      } catch (err) {
        console.error('Failed to generate QR code image:', err);
      }
    });

    whatsappClient.on('ready', () => {
      console.log('✅ WhatsApp Bot is ready and listening for messages!');
      waStatus = 'connected';
      waQrUrl = null;
    });

    whatsappClient.on('disconnected', (reason) => {
      console.log('❌ WhatsApp Bot disconnected', reason);
      waStatus = 'disconnected';
      waQrUrl = null;
    });

    whatsappClient.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp Bot auth failure', msg);
      waStatus = 'auth_failure';
      waQrUrl = null;
    });

    whatsappClient.on('message', async (msg) => {
      try {
        // Ignore status and group messages
        if (msg.isStatus || msg.from.includes('@g.us')) return;

        const text = msg.body.trim();
        const sender = msg.from;

        // 1. Check if they are responding with their name
        if (pendingNames[sender]) {
          const apptId = pendingNames[sender];
          const appt = await WAAppointmentModel.findOne({ id: apptId });
          if (appt) {
            try {
              const contact = await msg.getContact();
              const realPhone = contact.number || sender.replace(/@.*$/, '');
              appt.patientName = text;
              appt.patientPhone = realPhone; 
              appt.whatsappChatId = sender;
              await appt.save();
              delete pendingNames[sender];
              
              await msg.reply(`Thanks ${text}! We have received your details. Our admin will review and confirm your appointment for ${appt.date} at ${appt.time} shortly.`);
              console.log(`Updated appointment ${apptId} with name: ${text}, phone: ${realPhone}, chatId: ${sender}`);
            } catch (err) {
              console.error("Error processing contact info:", err);
            }
          } else {
            delete pendingNames[sender];
          }
          return;
        }

        // 2. Check if it's the initial booking message from the website
        const match = text.match(/Ref:\s*(A\d{6})/i);
        if (match) {
          const apptId = match[1];
          const appt = await WAAppointmentModel.findOne({ id: apptId });
          
          if (appt) {
            pendingNames[sender] = apptId;
            await msg.reply(`Hello! To proceed with your appointment request for ${appt.date} at ${appt.time}, please reply with your full name.`);
            console.log(`Received booking request for ${apptId} from ${sender}`);
          }
        }
      } catch (dbErr) {
        console.error("Error handling whatsapp message (Database might be disconnected):", dbErr);
      }
    });

    whatsappClient.initialize().catch((err: any) => {
      console.error("WhatsApp Bot failed to initialize. Skipping WhatsApp integration.", err.message);
      waStatus = 'disconnected';
    });
  } catch (err) {
    console.error("Failed to initialize WhatsApp bot", err);
    waStatus = 'disconnected';
  }
}

// Helper: generate 10-minute time slots from availability ranges
function generateSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let current = sh * 60 + sm;
  const end = eh * 60 + em;

  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push(`${h12}:${m.toString().padStart(2, '0')} ${period}`);
    current += 10;
  }
  return slots;
}

// --- WhatsApp Status Endpoints ---

app.get("/api/whatsapp/status", (req, res) => {
  res.json({ status: waStatus, qr: waQrUrl });
});

app.post("/api/whatsapp/reconnect", async (req, res) => {
  if (waStatus === 'initializing') {
    return res.json({ success: false, message: 'Already initializing' });
  }
  
  try {
    if (whatsappClient) {
      await whatsappClient.destroy();
    }
  } catch (err) {
    console.error("Error destroying whatsapp client", err);
  }
  
  setupWhatsAppBot();
  res.json({ success: true, status: waStatus });
});

// --- WhatsApp Appointment Endpoints ---

app.get("/api/wa-appointments", authMiddleware, async (req, res) => {
  const appts = await WAAppointmentModel.find().sort({ createdAt: -1 });
  res.json(appts);
});

app.get("/api/wa-appointments/:id", async (req, res) => {
  const appt = await WAAppointmentModel.findOne({ id: req.params.id });
  if (!appt) return res.status(404).json({ error: "Appointment not found." });
  res.json(appt);
});

app.post("/api/wa-appointments", async (req, res) => {
  const { date, time } = req.body;
  if (!date || !time) {
    return res.status(400).json({ error: "Date and time are required." });
  }

  const id = `A${Date.now().toString().slice(-6)}`;

  const newAppt = await WAAppointmentModel.create({
    id,
    doctor: "Dr. Vanita Methi",
    patientName: "",
    patientPhone: "",
    date,
    time,
    status: "pending",
    source: "whatsapp",
    notes: ""
  });

  res.status(201).json(newAppt);
});

app.patch("/api/wa-appointments/:id", authMiddleware, async (req, res) => {
  const appt = await WAAppointmentModel.findOne({ id: req.params.id });
  if (!appt) return res.status(404).json({ error: "Appointment not found." });

  const { status, patientName, patientPhone, date, time, notes } = req.body;
  const oldStatus = appt.status;

  if (status) appt.status = status;
  if (patientName !== undefined) appt.patientName = patientName;
  if (patientPhone !== undefined) appt.patientPhone = patientPhone;
  if (date) appt.date = date;
  if (time) appt.time = time;
  if (notes !== undefined) appt.notes = notes;
  
  await appt.save();

  // Send WhatsApp confirmation if status changed to 'confirmed'
  if (status === 'confirmed' && oldStatus !== 'confirmed' && whatsappClient) {
    const chatId = appt.whatsappChatId || (appt.patientPhone.includes('@') ? appt.patientPhone : `${appt.patientPhone}@c.us`);
    whatsappClient.sendMessage(chatId, `Your appointment with Dr. Vanita Methi for ${appt.date} at ${appt.time} is CONFIRMED. Thank you!`)
      .catch(e => console.error("Failed to send WA confirmation to", chatId, ":", e));
  }

  res.json(appt);
});

// --- Availability Endpoints ---

app.get("/api/availability", async (req, res) => {
  const config = await AvailabilityModel.find();
  res.json(config);
});

app.put("/api/availability", authMiddleware, async (req, res) => {
  const { availability } = req.body;
  if (!Array.isArray(availability)) {
    return res.status(400).json({ error: "availability array is required." });
  }
  await AvailabilityModel.deleteMany({});
  const config = await AvailabilityModel.insertMany(availability);
  res.json(config);
});

app.get("/api/availability/:date/slots", async (req, res) => {
  const dateStr = req.params.date; // e.g. "2026-09-03"
  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dateObj.getDay()];

  // Check if date is blocked
  const isBlocked = await BlockedDateModel.exists({ date: dateStr });
  if (isBlocked) {
    return res.json([]);
  }

  // Find matching availability ranges for this day of week
  const daySlots = await AvailabilityModel.find({ day: dayName, active: true });
  if (daySlots.length === 0) {
    return res.json([]);
  }

  // Generate all possible 30-min slots
  const allSlots: string[] = [];
  for (const range of daySlots) {
    allSlots.push(...generateSlots(range.startTime, range.endTime));
  }

  // Check which slots are already booked
  const bookedAppts = await WAAppointmentModel.find({ date: dateStr, status: { $ne: 'cancelled' } });
  const bookedTimes = bookedAppts.map(a => a.time);

  const result = allSlots.map(time => ({
    time,
    available: !bookedTimes.includes(time)
  }));

  res.json(result);
});

// --- Blocked Dates Endpoints ---

app.get("/api/blocked-dates", async (req, res) => {
  const dates = await BlockedDateModel.find();
  res.json(dates);
});

app.post("/api/blocked-dates", authMiddleware, async (req, res) => {
  const { date, reason } = req.body;
  if (!date) return res.status(400).json({ error: "Date is required." });
  const exists = await BlockedDateModel.exists({ date });
  if (exists) {
    return res.status(409).json({ error: "Date is already blocked." });
  }
  const entry = await BlockedDateModel.create({ date, reason });
  res.status(201).json(entry);
});

app.delete("/api/blocked-dates/:date", authMiddleware, async (req, res) => {
  const result = await BlockedDateModel.deleteOne({ date: req.params.date });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Blocked date not found." });
  res.status(204).send();
});

// Virtual AI Surgical Consultant
app.post("/api/consult", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  if (!ai) {
    return res.json({
      text: "Our virtual surgical advisor is currently in consultation assistant mode. To enable the live AI consultation, please verify that your GEMINI_API_KEY is configured."
    });
  }

  try {
    // Format the history for Gemini API
    const contents = messages.map(m => {
      return {
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      };
    });

    const systemInstruction = `You are Dr. Vanita Methi's AI Dermatology Consultation Companion, a virtual assistant at the prestigious DR METHI ENT CARE AND SKIN TALKS clinic.
Your tone is sophisticated, reassuring, empathetic, and medically authoritative.
Always write with elegant, editorial flair, matching the premium brand of DR METHI ENT CARE AND SKIN TALKS.
Provide informative guidance on dermatology procedures, recovery expectations, and candidacy considerations:
1. Acne Treatment & Scarring (nose reshaping, dorsal hump correction, tip refinement, revision acne treatment).
2. Microneedling & Lift (implant types, natural fat transfer, mastopexy, implant sizing).
3. Chemical Peel & Liposuction (360° lipo, tummy tuck, BBL, arm/thigh lift, post-weight-loss surgery).
4. Laser Skin Resurfacing (deep plane, SMAS, mini laser resurfacing, platysmaplasty, thread lift).
5. Botox & Eye Rejuvenation (upper/lower eyelid surgery, brow lift).
6. Non-Surgical Injectables (Botox, fillers, Sculptra, Kybella, PRP, liquid laser resurfacing).

When patients ask about procedures, explain the surgical technique and expected recovery simply but precisely.
Gently encourage booking a private consultation at DR METHI ENT CARE AND SKIN TALKS, emphasizing discrete, personalized evaluation by Dr. Vanita Methi.
Never provide specific medical advice, definitive diagnoses, or guarantee outcomes, but provide world-class informational guidance.
Discuss recovery timelines, candidacy factors, and what to expect during consultations with expert precision.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API error in /api/consult:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI consultation." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    setupWhatsAppBot();
  });
}

startServer();
