import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const DEFAULT_POSTS = [
  {
    id: 'insta-1',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    caption: 'Celebrating life, films, and pure music alongside my love @syedomyofficial. Let the rhythm guide us. #Dhallywood #CoupleVibes',
    likes: '24.8K',
    comments: 480,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-2',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop',
    caption: 'Cox\'s Bazar diaries for Matal shoot! Transformed into a unique look at the scenic dried fish village. #Matal2024 #SyedOmy',
    likes: '19.2K',
    comments: 312,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-3',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    caption: 'Classic traditional lehenga for the evening gala. Forever in love with crimson tones and classical aesthetics. #GlamourShoot',
    likes: '31.5K',
    comments: 890,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-4',
    imageUrl: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=600&auto=format&fit=crop',
    caption: 'Getting ready for a performance with Super Team DLA at Bashundhara ICCB. Let’s rock the stage! #LiveChoreography',
    likes: '15.6K',
    comments: 240,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-5',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop',
    caption: 'On-location filming for new web content in Sylhet valleys! Can\'t wait to bring you all this new story. #WebSeries',
    likes: '22.3K',
    comments: 455,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-6',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    caption: 'An unforgettable moment holding the CONIC Fashion Best Actress Laurel. Your endless support keeps me going! #Laurels #SyedOmy',
    likes: '28.9K',
    comments: 630,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-7',
    imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=600&auto=format&fit=crop',
    caption: 'Sultana Bibiana nostalgia. Revisiting flower farms and folksy tunes. Simple, authentic, and beautiful. #ArtisticCinema',
    likes: '18.1K',
    comments: 298,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-8',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    caption: 'Every studio session is a brand new start. New portraits and editorial spreads coming up real soon! Stay beautiful, stars. #Editorial',
    likes: '26.4K',
    comments: 512,
    postUrl: 'https://www.instagram.com/achol_akhee'
  }
];

const DATA_FILE_PATH = path.join(process.cwd(), "instagram_data.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request body parser
  app.use(express.json({ limit: "15mb" }));

  // API route to GET Instagram data
  app.get("/api/instagram", (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        const parsed = JSON.parse(fileContent);
        return res.json({
          success: true,
          source: "file",
          data: parsed
        });
      } else {
        // Fallback to default posts and save them to create the initial file
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_POSTS, null, 2), "utf-8");
        return res.json({
          success: true,
          source: "default",
          data: DEFAULT_POSTS
        });
      }
    } catch (error: any) {
      console.error("Failed to read Instagram data file:", error.message);
      return res.json({
        success: true,
        source: "fallback_error",
        data: DEFAULT_POSTS
      });
    }
  });

  // API route to SAVE Instagram data manually
  app.post("/api/instagram", (req, res) => {
    try {
      const { data } = req.body;
      if (!Array.isArray(data)) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format. Expected an array of posts."
        });
      }

      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      return res.json({
        success: true,
        message: "Instagram posts saved successfully!"
      });
    } catch (error: any) {
      console.error("Failed to save Instagram data file:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to save posts: " + error.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
