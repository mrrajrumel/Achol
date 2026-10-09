/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilmProject, AwardItem } from './types';
import BhoolImage from './assets/images/movie/Bhool.jpg';
import BaileyRoadImage from './assets/images/movie/bailey-road.jpg';
import JothilPremImage from './assets/images/movie/JothilPrem.jpg';
import PremPremPaglamiImage from './assets/images/movie/prem-prem-paglami.jpg';
import KiPremDekhaImage from './assets/images/movie/ki-prem-dekhaila.jpeg';
import FaandTheTrapImage from './assets/images/movie/faand-the-trap.jpg';
import kistimaatImage from './assets/images/movie/kistimaat.jpg';
import gundatheterroristImage from './assets/images/movie/gundatheterrorist.jpg';
import ajobpremImage from './assets/images/movie/ajobprem.jpg';
import ranaPaglaImage from './assets/images/movie/rana-pagla-mental.jpg';
import sultanaBibianaImage from './assets/images/movie/sultana-bibiana.jpg';
import daagHridoyeImage from './assets/images/movie/daag-hridoye.jpg';
import mafiaImage from './assets/images/movie/mafia.jpg';
import raagiImage from './assets/images/movie/raagi.jpg';
import indubalaImage from './assets/images/web/indubala.jpg';
import dhokaImage from './assets/images/web/dhoka.jpg';
import journeyImage from './assets/images/web/journey.jpg';

// Accurate, real-world data matched directly from the official biography PDF and celebrity records
export const filmographyProjects: FilmProject[] = [
  {
    id: 'bhool',
    title: 'Bhool',
    year: 2011,
    category: 'Movies',
    role: 'Lakshmi (Debut Lead)',
    badge: 'Debut Release',
    description: 'Achol\'s highly praised film debut. Her breakthrough performance as Lakshmi established her artistic caliber and classical drama range.',
    imageUrl: BhoolImage,
  },
  {
    id: 'bailey_road',
    title: 'Bailey Road',
    year: 2011,
    category: 'Movies',
    role: 'Lead Protagonist',
    badge: 'Early Success',
    description: 'A stellar drama centering the culture and emotional narrative of Dhaka, proving Achol\'s extreme versatility in the same year as her debut.',
    imageUrl: BaileyRoadImage,
  },
  {
    id: 'jotil_prem',
    title: 'Jotil Prem',
    year: 2013,
    category: 'Movies',
    role: 'Achol (Lead)',
    badge: 'Romantic Blockbuster',
    description: 'The romantic blockbuster with Bappy Chowdhury that made Achol a household star and set major box-office records.',
    imageUrl: JothilPremImage,
  },
  {
    id: 'prem_prem_paglami',
    title: 'Prem Prem Paglami',
    year: 2013,
    category: 'Movies',
    role: 'Simi (Lead)',
    badge: 'Box Office Hit',
    description: 'A hit romantic film starring Achol and Bappy Chowdhury that won hearts and topped the box office in theatres.',
    imageUrl: PremPremPaglamiImage,
  },
  {
    id: 'ki_prem_dekhaila',
    title: 'Ki Prem Dekhaila',
    year: 2013,
    category: 'Movies',
    role: 'Achol (Lead)',
    badge: 'Popular Drama',
    description: 'An emotional romantic drama co-starring Bappy Chowdhury, celebrated for its chart-topping songs and memorable musical scenes.',
    imageUrl: KiPremDekhaImage,
  },
  {
    id: 'faand_the_trap',
    title: 'Faand: The Trap',
    year: 2014,
    category: 'Movies',
    role: 'Novia (Lead)',
    badge: 'Action Blockbuster',
    description: 'A thrilling action film co-starring superstar Shakib Khan, filmed across international locations with grand cinematic scale.',
    imageUrl: FaandTheTrapImage,
  },
  {
    id: 'kistimaat',
    title: 'Kistimaat',
    year: 2014,
    category: 'Movies',
    role: 'Piya (Lead)',
    badge: 'Sensational Hit',
    description: 'A hit action and romance movie starring Achol and Arifin Shuvoo, celebrated for its stylish story and memorable music.',
    imageUrl: kistimaatImage,
  },
  {
    id: 'gunda_the_terrorist',
    title: 'Gunda: The Terrorist',
    year: 2015,
    category: 'Movies',
    role: 'Lead Heroine',
    badge: 'Action Success',
    description: 'A massive commercial action venture containing Achol\'s popular performance and the hit song track "O My Heart".',
    imageUrl: gundatheterroristImage,
  },
  {
    id: 'ajob_prem',
    title: 'Ajob Prem',
    year: 2015,
    category: 'Movies',
    role: 'Lead Actress',
    badge: 'Musical Romance',
    description: 'An engaging romantic comedy featuring the highly successful, multi-million hit song track "Aaj Duchokhe".',
    imageUrl: ajobpremImage,
  },
  {
    id: 'rana_pagla_mental',
    title: 'Rana Pagla: The Mental',
    year: 2016,
    category: 'Movies',
    role: 'Shimi (Lead)',
    badge: 'Dhallywood Mega Production',
    description: 'A star-studded, commercially dominant psychological thriller partnering with Shakib Khan and Nusraat Faria.',
    imageUrl: ranaPaglaImage,
  },
  {
    id: 'sultana_bibiana',
    title: 'Sultana Bibiana',
    year: 2017,
    category: 'Movies',
    role: 'Key Performance',
    badge: 'Critical Masterpiece',
    description: 'A visually gorgeous artistic masterwork based around local flower farming communities, widely hailed for Achol\'s classical elegance.',
    imageUrl: sultanaBibianaImage,
  },
  {
    id: 'daag_hridoye',
    title: 'Daag Hridoye',
    year: 2019,
    category: 'Movies',
    role: 'Central Cast',
    badge: 'Dramatic Success',
    description: 'An evocative romantic drama exploring complex romantic linkages and high-emotion dialogue scripts.',
    imageUrl: daagHridoyeImage,
  },
  {
    id: 'mafia',
    title: 'Mafia',
    year: 2022,
    category: 'Movies',
    role: 'Lead Female',
    badge: 'Latest Theatrical Release',
    description: 'A modern suspenseful action thriller presenting Achol\'s powerful cinematic return opposite Monwar Hossain Imon.',
    imageUrl: mafiaImage,
  },
  {
    id: 'raagi',
    title: 'Raagi',
    year: 2022,
    category: 'Movies',
    role: 'Special Lead Appearance',
    badge: 'Intense Action Drama',
    description: 'Achol\'s recent dramatic release, containing her beautiful and widely-praised romantic soundtrack item "Ador Chokhe".',
    imageUrl: raagiImage,
  },
  {
    id: 'indubala_series',
    title: 'Indubala',
    year: 2018,
    category: 'Web Series',
    role: 'Indubala (Lead Title)',
    badge: 'OTT Critical Breakthrough',
    description: 'Achol\'s highly lauded OTT web series debut, playing the title character Indubala in a thrilling storyline of resilience and justice.',
    imageUrl: indubalaImage,
  },
  {
    id: 'dhoka_series',
    title: 'Dhoka',
    year: 2020,
    category: 'Web Series',
    role: 'Riya (Key Lead)',
    badge: 'Digital Suspense Thriller',
    description: 'An acclaimed modern digital suspense production profiling complex narrative twists and digital premiere accolades.',
    imageUrl: dhokaImage,
  },
  {
    id: 'journey_series',
    title: 'Journey',
    year: 2020,
    category: 'Web Series',
    role: 'Central Narrative Character',
    badge: 'Popular Web Drama',
    description: 'A successful contemporary web drama, charting significant digital reception and displaying Achol\'s alignment with modern streaming releases.',
    imageUrl: journeyImage,
  },
  {
    id: 'o_jan_re',
    title: 'O Jan Re',
    year: 2021,
    category: 'Music Videos',
    role: 'Leading Star',
    badge: 'YouTube Viral Sensation',
    description: 'A grand musical film release. Accumulating millions of online views, Achol\'s dramatic elegance was highly praised by fans.',
    embedId: 'LiYD7oZ1VcI',
    imageUrl: 'https://www.youtube.com/watch?v=LiYD7oZ1VcI',
  },
  {
    id: 'tui_chara_ke_ache_bol',
    title: 'Tui Chara Ke Ache Bol',
    year: 2023,
    category: 'Music Videos',
    role: 'Lead Model',
    badge: 'Romantic Duet Track',
    description: 'A scenic hit music video sung by Syed Omy & Atiya Anisha, capturing a spectacular narrative driven by Achol.',
    embedId: 'lm1E5qA67yw',
    imageUrl: '',
  },
  {
    id: 'matal',
    title: 'Matal',
    year: 2024,
    category: 'Music Videos',
    role: 'South-Indian Style Lead',
    badge: 'High-Budget Shoot',
    description: 'Filmed in Cox\'s Bazar rustic dry fish village (শুটকি পল্লী). Features a unique styling look. Conceived and composed by singer Syed Omy.',
    embedId: '4bxB1EVTl3U',
    imageUrl: '',
  },
  {
    id: 'baby_kotha_suina_jaw',
    title: 'Baby Kotha Suina Jaw',
    year: 2024,
    category: 'Music Videos',
    role: 'Glamour Co-Star',
    badge: 'Syed Omy Collaboration',
    description: 'A playful festive single featuring energetic screen choreography, vibrant styling, and stellar visual chemistry.',
    embedId: 'jQEJtMITIRQ',
    imageUrl: 'https://www.youtube.com/watch?v=jQEJtMITIRQ',
  },
  {
    id: 'aam_pata_jora_jora',
    title: 'Aam Pata Jora Jora',
    year: 2026,
    category: 'Music Videos',
    role: 'Central Festal Model',
    badge: 'Latest Summer Track',
    description: 'A colorful high-energy track released in May 2026 on Syed Omy\'s official media channels, co-starring popular vocalist Kona.',
    embedId: 'fKkcAhT8AWc',
    imageUrl: 'https://www.youtube.com/watch?v=fKkcAhT8AWc',
  },
  {
    id: 'pori_paichi_re',
    title: 'Pori Paichi Re',
    year: 2025,
    category: 'Music Videos',
    role: 'Lead Female Character',
    badge: 'Upbeat Dance Release',
    description: 'Vibrant performance-backed romantic single released in January 2025, directed and co-starred by popular singer Syed Omy.',
    embedId: 'WUnmxqZMMMQ',
    imageUrl: 'https://www.youtube.com/watch?v=WUnmxqZMMMQ',
  },
  {
    id: 'dui_chakkar_cycle',
    title: 'Dui Chakkar Cycle',
    year: 2024,
    category: 'Music Videos',
    role: 'Lead Visual Narrator',
    badge: 'International Shoot',
    description: 'A grand international production shot dynamically across Malaysia and Sylhet valleys, co-starring duet husband Syed Omy and Sanjiida Rimi.',
    embedId: 'dymeX_rV5no',
    imageUrl: 'https://www.youtube.com/watch?v=dymeX_rV5no',
  },
  {
    id: 'conic_fashion_awards',
    title: 'CONIC Fashion Awards Gala',
    year: 2022,
    category: 'Other Projects',
    role: 'dance performe',
    badge: 'Mehedi Food Court Concert 2020',
    description: 'Achol & DLA Dance || Valoka Concert 2020',
    embedId: 'OyucwqUF8lI',
  },
  {
    id: 'dhallywood_dance_achievers',
    title: 'Global Achievers Super Gala',
    year: 2023,
    category: 'Other Projects',
    role: 'Dance Performer (BIFA AWARDS)',
    badge: 'BIFA AWARDS',
    description: 'Chand Mama Lit Up the Stage | Prarthana Fardin Dighi',
    embedId: 'J-jK_G-siEk',
  }
];

export const timelineAwards: AwardItem[] = [
  {
    year: '2011',
    title: 'Best Critic Debut of the Year (Bhool)',
    organization: 'Dhallywood Film Critic Association',
    description: 'Honored for representing Lakshmi with remarkable emotional nuance and classical elegance.'
  },
  {
    year: '2013',
    title: 'Best Promising Actress (Jotil Prem)',
    organization: 'Bangladesh National Cultural Society',
    description: 'Awarded for her hit romantic pairing that drew big crowds back to movie theatres.'
  },
  {
    year: '2014',
    title: 'Generational Glamour & Style Icon',
    organization: 'Dhallywood Fashion Guild Association',
    description: 'Honored for leading major brand ad campaigns and setting fashion trends on screen.'
  },
  {
    year: '2018',
    title: 'Outstanding Digital Performance (Indubala)',
    organization: 'South Asian OTT Excellence Guild',
    description: 'Praised for her starring role in Indubala, marking her successful debut in major web series.'
  },
  {
    year: '2022',
    title: 'Best Musical Film Actor duo (CONIC Awards)',
    organization: 'Conic Fashion & Media Society',
    description: 'Awarded with husband Syed Omy for their hit music videos and creative visuals.'
  },
  {
    year: '2023',
    title: 'National Stage Performer of Honor',
    organization: 'Global Achievers & Women Leadership Awards',
    description: 'Awarded at ICCB Bashundhara for her live stage shows and classical dance.'
  }
];

export const showreelVideos = [
  {
    id: 'video-1',
    title: 'Ajob Prem (2015) | Official Trailer',
    duration: '2:45',
    thumbnail: 'https://www.youtube.com/watch?v=CoCLkTF8bJs',
    embedId: 'CoCLkTF8bJs',
    desc: 'Ajob Prem (2015) | Official Trailer | Bengali Movie | Bappy | Achol | Joy Chowdhury'
  },
  {
    id: 'video-2',
    title: 'Raagi Movie Trailer',
    duration: '3:10',
    thumbnail: 'https://www.youtube.com/watch?v=-yDDzp0t9PY',
    embedId: 'yDDzp0t9PY',
    desc: 'Raagi - Abir Chowdhury | Achol Akhee | Moon Moon | Bangla Movie'
  },
  {
    id: 'video-3',
    title: 'Kistimaat - Theatrical Trailer',
    duration: '2:15',
    thumbnail: 'https://www.youtube.com/watch?v=ZF7_FQzYdaA',
    embedId: 'ZF7_FQzYdaA',
    desc: 'Kistimaat | কিস্তিমাত | Theatrical Trailer | Arifin Shuvoo | Achol | Misha Sawdagar | Bengali Movie'
  }
];

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: string;
  comments: number;
  postUrl: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    id: 'insta-1',
    imageUrl: 'https://img-mm.manoramaonline.com/content/dam/mm/mo/web-stories/movies/images/2024/8/2/achol-akhe-6.jpg',
    caption: '#Dhallywood #CoupleVibes',
    likes: '24.8K',
    comments: 480,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-2',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe1QvPgNmkiRpPmggWei6BrHVFQf2UuCx0HGciuGq9NKtCCx2PuELPjc&s=10',
    caption: '#Dhallywood #CoupleVibes',
    likes: '19.2K',
    comments: 312,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-3',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz8KK5B9FwV-eRrpoFYMfy4JnuX376QQDcapJImR1d3DPdulJZMy57VBw&s=10',
    caption: 'aesthetics. #GlamourShoot',
    likes: '31.5K',
    comments: 890,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-4',
    imageUrl: 'https://i0.wp.com/1.bp.blogspot.com/-v6Lnpp-tQl8/XXQF2cLSSkI/AAAAAAAAD0A/DOVoypVWNu8zySbXeTl4qdfFZhgfxhV5QCLcBGAs/s1600/Bangladeshi-actress-Achol.jpg?w=1080&ssl=1',
    caption: 'Getting ready',
    likes: '15.6K',
    comments: 240,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-5',
    imageUrl: 'https://alchetron.com/cdn/achol-9b11c854-f381-4f93-9f37-3d5b00e8ba1-resize-750.jpeg',
    caption: '#WebSeries',
    likes: '22.3K',
    comments: 455,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-6',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQarjBqtGhI1_RifrGrOajNe8DJxuM2Ph5dJhWxDb17F00UsgXZpjkAm2A&s=10',
    caption: '',
    likes: '28.9K',
    comments: 630,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-7',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU9xwwLdLHJHkPNPPaLGRpPqOuBYpzqTgr4Um_8GBVqsmZnYbO7HIHdig&s=10',
    caption: 'Memories from Sultana Bibiana. Visiting flower fields and enjoying folk music. Pure, simple, and heartfelt. #Dhallywood',
    likes: '18.1K',
    comments: 298,
    postUrl: 'https://www.instagram.com/achol_akhee'
  },
  {
    id: 'insta-8',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqNGXGWdEwc9ERbc6BoNmTg3Mhvx1i3WIROLwSNM2YaQTo7QPd-etkiIn_&s=10',
    caption: 'Every studio session is a brand new start. New portraits and editorial spreads coming up real soon! Stay beautiful, stars. #Editorial',
    likes: '26.4K',
    comments: 512,
    postUrl: 'https://www.instagram.com/achol_akhee'
  }
];
