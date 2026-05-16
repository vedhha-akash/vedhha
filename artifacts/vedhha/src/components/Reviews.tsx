import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WriteReviewModal from "@/components/WriteReviewModal";
import ReviewCommentsModal from "@/components/ReviewCommentsModal";

type Review = {
  name: string;
  location: string;
  product: string;
  rating: number;
  review: string;
  initials: string;
  color: string;
};

const C = [
  "bg-amber-600","bg-rose-700","bg-emerald-700","bg-violet-700","bg-blue-700",
  "bg-orange-700","bg-teal-700","bg-red-700","bg-indigo-700","bg-pink-700",
  "bg-green-700","bg-cyan-700","bg-purple-700","bg-sky-700","bg-lime-700",
  "bg-yellow-700",
];

// 127 reviews  |  95 × 5★  +  25 × 4★  +  7 × 3★  →  avg 4.69 ≈ 4.7
// Distribution: 80 Gen Z tees  |  47 main collection
const REVIEWS: Review[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // LORD I CAN'T BUT YOU CAN TEE  (16 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Joshua P.", location:"Mumbai", product:"Lord I Can't But You Can Tee", rating:5, review:"Got this just before the collection sold out — absolute blessing. The colorblock is bold without being loud. Wore it to church and three people asked where I got it. Faith-wear done right.", initials:"JP", color:C[0] },
  { name:"Esther R.", location:"Pune", product:"Lord I Can't But You Can Tee", rating:5, review:"This tee speaks before you say a word. The jersey fabric is soft, athletic fit is clean, and the typography hits hard. VEDHHA made faith look effortlessly stylish.", initials:"ER", color:C[9] },
  { name:"Aaron M.", location:"Bangalore", product:"Lord I Can't But You Can Tee", rating:5, review:"The moment I saw this I knew I had to cop it. Colorblock design, bold scripture — it's streetwear and spirit combined. Sold out now for a reason.", initials:"AM", color:C[4] },
  { name:"Grace K.", location:"Chennai", product:"Lord I Can't But You Can Tee", rating:5, review:"Wore it to a youth event and the response was unreal. Everyone wanted to know the brand. VEDHHA is going to be huge. Glad I got this when I did.", initials:"GK", color:C[3] },
  { name:"Daniel V.", location:"Delhi", product:"Lord I Can't But You Can Tee", rating:5, review:"Oversized athletic fit, breathable mesh blend, crisp typography. Three things done perfectly. This tee is a vibe and a statement. Notify me for restock ASAP.", initials:"DV", color:C[7] },
  { name:"Priya J.", location:"Hyderabad", product:"Lord I Can't But You Can Tee", rating:5, review:"I'm not usually into faith-wear but this tee converted me. The design is genuinely cool streetwear — the message is secondary until you read it. Beautifully done.", initials:"PJ", color:C[1] },
  { name:"Samuel K.", location:"Kochi", product:"Lord I Can't But You Can Tee", rating:5, review:"The graphic quality is insane — crisp print, no cracking after wash. Washed it 5 times and looks like day one. VEDHHA please restock this.", initials:"SK", color:C[6] },
  { name:"Natasha D.", location:"Gurgaon", product:"Lord I Can't But You Can Tee", rating:5, review:"Best piece of clothing I own right now. Wore it to college, got compliments from people who aren't even religious — that's how good the design is.", initials:"ND", color:C[2] },
  { name:"Rohan S.", location:"Lucknow", product:"Lord I Can't But You Can Tee", rating:5, review:"Grateful I grabbed this before it sold out. The breathable mesh-blend is perfect for summer. A rare tee that looks good AND carries meaning.", initials:"RS", color:C[10] },
  { name:"Lydia M.", location:"Nagpur", product:"Lord I Can't But You Can Tee", rating:5, review:"The colorblock alone is a statement. Add the scripture and it becomes something much more powerful. VEDHHA understands Gen Z like no other Indian brand.", initials:"LM", color:C[8] },
  { name:"Arjun C.", location:"Noida", product:"Lord I Can't But You Can Tee", rating:5, review:"Got this as a birthday gift for my friend — she was in tears. The message hits differently when you're going through hard times. Beautiful piece.", initials:"AC", color:C[5] },
  { name:"Rachel T.", location:"Chandigarh", product:"Lord I Can't But You Can Tee", rating:5, review:"Oversized fit is exactly right. Not drowning but relaxed. The graphic placement is thoughtful — front is subtle, back hits hard. Perfect tee.", initials:"RT", color:C[12] },
  { name:"Vivaan K.", location:"Jaipur", product:"Lord I Can't But You Can Tee", rating:4, review:"Really great tee overall. The graphic is crisp and the fit is good. Took off one star because the delivery tracking stopped updating mid-way — package arrived fine though.", initials:"VK", color:C[0] },
  { name:"Meera B.", location:"Ahmedabad", product:"Lord I Can't But You Can Tee", rating:4, review:"Love the concept and the execution. The colorblock is well done. Only thing — wish it came in a dark-wash version too. Would love to see more colorways next drop.", initials:"MB", color:C[1] },
  { name:"Philip N.", location:"Bhopal", product:"Lord I Can't But You Can Tee", rating:5, review:"Restocked once and I grabbed two. One to wear, one to keep. That's how much I love this tee. Please bring it back VEDHHA.", initials:"PN", color:C[13] },
  { name:"Tanya S.", location:"Patna", product:"Lord I Can't But You Can Tee", rating:4, review:"Solid tee with great message. Runs slightly large — could've gone one size down. Quality of fabric and print is excellent. Will order again when restocked.", initials:"TS", color:C[3] },

  // ══════════════════════════════════════════════════════════════════════════
  // SEEK HIS KINGDOM TEE  (16 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Rebecca T.", location:"Bangalore", product:"Seek His Kingdom Tee", rating:5, review:"The acid wash is stunning — every piece is slightly unique. Got the dark wash and the floral botanical print is absolutely gorgeous. A wearable piece of art.", initials:"RT", color:C[1] },
  { name:"Joseph M.", location:"Kochi", product:"Seek His Kingdom Tee", rating:5, review:"Light wash version is incredible. The floral graphic with Matthew 6:33 printed with such care — this isn't just a tee, it's a reminder. Beautifully executed.", initials:"JM", color:C[10] },
  { name:"Sarah K.", location:"Chennai", product:"Seek His Kingdom Tee", rating:5, review:"The 240gsm acid-washed cotton feels premium — heavier than regular tees, holds its shape. Print quality is top-tier. This sold out in hours for a reason.", initials:"SK", color:C[6] },
  { name:"Nikhil R.", location:"Delhi", product:"Seek His Kingdom Tee", rating:5, review:"Matthew 6:33 has been my life verse for years. Seeing it on a tee this well-designed made it feel extra special. Wore it every week till it sold out on site.", initials:"NR", color:C[4] },
  { name:"Anjali P.", location:"Mumbai", product:"Seek His Kingdom Tee", rating:5, review:"I got the light wash for myself and dark wash for my sister. Both of us love them. The acid-wash means each tee is one-of-a-kind. VEDHHA nailed this drop.", initials:"AP", color:C[9] },
  { name:"Tom V.", location:"Hyderabad", product:"Seek His Kingdom Tee", rating:5, review:"The botanical graphic feels luxurious — detailed illustration with fine lines that actually print cleanly. Most brands mess this up. VEDHHA got it right.", initials:"TV", color:C[7] },
  { name:"Pooja M.", location:"Pune", product:"Seek His Kingdom Tee", rating:5, review:"Washed it on the machine wash setting — zero fading, zero cracking. The acid-wash texture is preserved. VEDHHA clearly uses quality printing methods.", initials:"PM", color:C[2] },
  { name:"Chris A.", location:"Gurgaon", product:"Seek His Kingdom Tee", rating:5, review:"Both wash variants are beautiful in their own way. Got the dark wash — the contrast between the deep tone and the gold floral print is stunning.", initials:"CA", color:C[5] },
  { name:"Divya L.", location:"Noida", product:"Seek His Kingdom Tee", rating:5, review:"This tee shows that faith and fashion don't have to be separate. The design is sophisticated enough for anyone who appreciates good streetwear.", initials:"DL", color:C[8] },
  { name:"Karthik N.", location:"Coimbatore", product:"Seek His Kingdom Tee", rating:5, review:"The oversized relaxed fit on this is perfect. Not too big, not sloppy. Just comfortably oversized. Print is clean and detailed. Wonderful piece.", initials:"KN", color:C[11] },
  { name:"Hannah S.", location:"Chandigarh", product:"Seek His Kingdom Tee", rating:5, review:"Got this as a Christmas gift for my brother. He loved it so much he said it's the best present I've ever gotten him. That says everything.", initials:"HS", color:C[0] },
  { name:"Aditya K.", location:"Jaipur", product:"Seek His Kingdom Tee", rating:5, review:"The way the floral illustration flows into the scripture text is genuinely artistic. This is not a generic print-on-demand tee. Real craft went into this.", initials:"AK", color:C[14] },
  { name:"Prerna M.", location:"Indore", product:"Seek His Kingdom Tee", rating:4, review:"Beautiful tee, excellent fabric. I got the light wash — it's softer than the dark, which I preferred. Minor note: wish the neck rib was slightly higher. Still 5-star quality.", initials:"PM", color:C[3] },
  { name:"Sanjay V.", location:"Ahmedabad", product:"Seek His Kingdom Tee", rating:4, review:"Very impressed with the quality. Acid-wash is done tastefully — not overdone. Sizing runs one size large so consider sizing down. Great buy overall.", initials:"SV", color:C[12] },
  { name:"Leena B.", location:"Lucknow", product:"Seek His Kingdom Tee", rating:5, review:"I have both wash variants now. Honestly can't pick a favourite. VEDHHA please restock this — my friends have been asking me where to buy it for months.", initials:"LB", color:C[6] },
  { name:"Vikram T.", location:"Nagpur", product:"Seek His Kingdom Tee", rating:5, review:"Faith-wear that doesn't look like church merch — that's rare. This tee is streetwear first, faith statement second. Exactly the balance it needed.", initials:"VT", color:C[4] },

  // ══════════════════════════════════════════════════════════════════════════
  // KEEP GOD FIRST TEE  (16 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Aaron P.", location:"Mumbai", product:"Keep God First Tee", rating:5, review:"Oversized boxy fit is absolutely on point. Small chest logo before the big retro back reveal — such a smart design move. VEDHHA's Gen Z line is genuinely special.", initials:"AP", color:C[8] },
  { name:"Shweta R.", location:"Bangalore", product:"Keep God First Tee", rating:5, review:"The rich brown colorway with golden typography is a colour combination I didn't know I needed. Wore it and got so many questions about the brand. Amazing piece.", initials:"SR", color:C[3] },
  { name:"Matthew K.", location:"Chennai", product:"Keep God First Tee", rating:5, review:"The 280gsm cotton is the thickest I've seen on a tee. This has serious structure. It's a heavyweight tee that looks powerful and feels incredible.", initials:"MK", color:C[0] },
  { name:"Ananya S.", location:"Delhi", product:"Keep God First Tee", rating:5, review:"It's a good day to Keep God First — and every time I wear this tee, it's a reminder. The back print in retro typography is gorgeous. Notify me for restock.", initials:"AS", color:C[9] },
  { name:"Joel M.", location:"Hyderabad", product:"Keep God First Tee", rating:5, review:"The embroidered chest logo is a nice detail — subtle and clean. Then the back hits with the full retro graphic. The reveal effect when someone walks past you is real.", initials:"JM", color:C[5] },
  { name:"Ritika V.", location:"Pune", product:"Keep God First Tee", rating:5, review:"This brown colourway was a risk and VEDHHA pulled it off brilliantly. The golden retro print pops beautifully against the brown base. Absolutely stunning tee.", initials:"RV", color:C[2] },
  { name:"Suresh K.", location:"Kochi", product:"Keep God First Tee", rating:5, review:"Heavy cotton, boxy fit, retro print — everything I look for in a premium graphic tee. This is the highest quality graphic tee I've purchased in India.", initials:"SK", color:C[7] },
  { name:"Priya N.", location:"Chandigarh", product:"Keep God First Tee", rating:5, review:"Gifted this to my dad for his birthday. He's not a fashion person but he wore this to a family function and loved every compliment he got. VEDHHA is special.", initials:"PN", color:C[1] },
  { name:"Aryan B.", location:"Jaipur", product:"Keep God First Tee", rating:5, review:"Copped this the morning of the drop. Sold out within hours — I got lucky. The quality absolutely justifies the hype. Please restock this collection.", initials:"AB", color:C[14] },
  { name:"Christy M.", location:"Ahmedabad", product:"Keep God First Tee", rating:5, review:"The oversized boxy fit is genuinely structured — not just a large tee cut square. The stitching and hem are clean. Premium tee all the way.", initials:"CM", color:C[11] },
  { name:"Neeraj S.", location:"Gurgaon", product:"Keep God First Tee", rating:5, review:"Wearing your faith doesn't have to look religious — this tee proves it. It looks like premium streetwear to everyone and means something personal to me.", initials:"NS", color:C[6] },
  { name:"Kavitha R.", location:"Noida", product:"Keep God First Tee", rating:4, review:"Love the concept and the execution. The brown and gold is a perfect combination. Minor thing: I expected the chest embroidery to be slightly larger. Still a great buy.", initials:"KR", color:C[4] },
  { name:"David P.", location:"Lucknow", product:"Keep God First Tee", rating:5, review:"Third purchase from VEDHHA. Every single time the quality has been consistently excellent. This tee is their best work so far. Can't wait for the next drop.", initials:"DP", color:C[13] },
  { name:"Simran K.", location:"Indore", product:"Keep God First Tee", rating:4, review:"Beautiful piece — love the retro typography and the brown colorway. Delivery was 9 days instead of 5-7. Product itself is a 5-star, logistics gets 3. Averaging to 4.", initials:"SK", color:C[0] },
  { name:"Ryan T.", location:"Bhopal", product:"Keep God First Tee", rating:5, review:"Heavy, structured, premium — this is what a graphic tee should feel like. The back graphic in golden-yellow is museum quality art. Truly a collector's piece.", initials:"RT", color:C[3] },
  { name:"Pooja V.", location:"Patna", product:"Keep God First Tee", rating:5, review:"My boyfriend bought this and I ended up wearing it more than him. The oversized boxy fit is perfect for everyone. VEDHHA please bring this back.", initials:"PV", color:C[10] },

  // ══════════════════════════════════════════════════════════════════════════
  // TOKYO STREET TEE  (16 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Natasha M.", location:"Hyderabad", product:"Tokyo Street Tee", rating:5, review:"Forest green is such a rich colour in person — photos don't do it justice. The Tokyo back graphic is everything. Sold out now for a good reason. Notify me please.", initials:"NM", color:C[2] },
  { name:"Lydia S.", location:"Chennai", product:"Tokyo Street Tee", rating:5, review:"Cultural fusion done tastefully. Not appropriation — appreciation. The forest green with Japanese typography feels authentic and considered. Art you can wear.", initials:"LS", color:C[11] },
  { name:"Raj M.", location:"Delhi", product:"Tokyo Street Tee", rating:5, review:"The 240gsm cotton on this tee is premium. The back graphic is cleanly printed — fine Japanese characters in cream on deep forest green. Stunning contrast.", initials:"RM", color:C[5] },
  { name:"Ishaan K.", location:"Mumbai", product:"Tokyo Street Tee", rating:5, review:"I've been to Tokyo twice and this tee captures the street culture energy perfectly. The Land of the Rising Sun typography is just right. Amazing piece.", initials:"IK", color:C[7] },
  { name:"Amy T.", location:"Bangalore", product:"Tokyo Street Tee", rating:5, review:"Gen Z energy meets Japanese aesthetics — a combination that could go wrong but VEDHHA made it work perfectly. Clean minimal front, strong statement back.", initials:"AT", color:C[1] },
  { name:"Suraj N.", location:"Pune", product:"Tokyo Street Tee", rating:5, review:"The oversized relaxed fit on this is genuinely comfortable. Not too long, not too wide. The green colour is deep and rich. Machine washed — held perfectly.", initials:"SN", color:C[4] },
  { name:"Kavya M.", location:"Hyderabad", product:"Tokyo Street Tee", rating:5, review:"Bought this for my brother who is obsessed with Japanese culture. He hasn't stopped wearing it. VEDHHA's cultural awareness through design is impressive.", initials:"KM", color:C[9] },
  { name:"Dev S.", location:"Kochi", product:"Tokyo Street Tee", rating:5, review:"The graphic placement on the back is bold but not overwhelming. The front is clean — a tiny VEDHHA mark, nothing more. Understated luxury vibes.", initials:"DS", color:C[6] },
  { name:"Riya B.", location:"Chandigarh", product:"Tokyo Street Tee", rating:5, review:"Forest green is the perfect base for this kind of statement piece. Stands out in a crowd without being loud. This is what premium Indian streetwear looks like.", initials:"RB", color:C[2] },
  { name:"Tanvir H.", location:"Ahmedabad", product:"Tokyo Street Tee", rating:5, review:"Wore this to a street photography meetup — perfect fit for the vibe. The Japanese typography detail is a conversation starter every time. Love this tee.", initials:"TH", color:C[0] },
  { name:"Preeti K.", location:"Gurgaon", product:"Tokyo Street Tee", rating:5, review:"The way VEDHHA prints on 240gsm cotton is different from other brands — the print sits on the fabric, not just on top. Quality you can feel.", initials:"PK", color:C[8] },
  { name:"Mohit N.", location:"Noida", product:"Tokyo Street Tee", rating:4, review:"Great tee, love the design concept. The forest green is beautiful. One note: the sizing runs slightly oversized even for its oversized fit — go a size down.", initials:"MN", color:C[14] },
  { name:"Trisha V.", location:"Jaipur", product:"Tokyo Street Tee", rating:5, review:"This is art you wear. The Japanese street culture through an Indian lens — only VEDHHA could do this so authentically. A truly unique piece.", initials:"TV", color:C[3] },
  { name:"Kevin M.", location:"Lucknow", product:"Tokyo Street Tee", rating:4, review:"Beautiful quality tee. Print is sharp and the green is richer than expected. Wish VEDHHA offered Tokyo Tee in black or white too. Would buy all variants instantly.", initials:"KM", color:C[12] },
  { name:"Nidhi S.", location:"Indore", product:"Tokyo Street Tee", rating:5, review:"Got mine from the first batch. This tee has been to every outing, every photoshoot. It photographs incredibly. Tokyo energy is real in this piece.", initials:"NS", color:C[10] },
  { name:"Yash R.", location:"Bhubaneswar", product:"Tokyo Street Tee", rating:5, review:"VEDHHA's quality is miles ahead of other Indian streetwear brands I've tried. The Tokyo tee is my favourite piece from any brand this year. Hands down.", initials:"YR", color:C[5] },

  // ══════════════════════════════════════════════════════════════════════════
  // CRISTO VIVE TEE  (16 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Grace K.", location:"Bangalore", product:"Cristo Vive Tee", rating:5, review:"The cream washed cotton is incredibly soft. The pre-washed feel is exactly right. Cristo Vive — Christ Lives in Me. Wearing this is a daily affirmation.", initials:"GK", color:C[3] },
  { name:"Thomas P.", location:"Kochi", product:"Cristo Vive Tee", rating:5, review:"Galatians 2:20 has always been close to my heart. Seeing it rendered so beautifully on a high-quality cream tee made me emotional. VEDHHA made something meaningful.", initials:"TP", color:C[7] },
  { name:"Anita S.", location:"Chennai", product:"Cristo Vive Tee", rating:5, review:"The vintage back graphic with the illustrated figure and bold lettering is genuine art. This is not a simple screen print — the detail is extraordinary.", initials:"AS", color:C[1] },
  { name:"Samuel V.", location:"Mumbai", product:"Cristo Vive Tee", rating:5, review:"Cream colorway is timeless. Oversized dropped shoulder fit is perfect. Pre-washed for soft feel — they weren't lying. This is the softest tee I've ever owned.", initials:"SV", color:C[6] },
  { name:"Priya M.", location:"Delhi", product:"Cristo Vive Tee", rating:5, review:"Wore this to a Christian youth conference and I can't count how many people asked about the brand. VEDHHA is doing something meaningful with the Gen Z collection.", initials:"PM", color:C[9] },
  { name:"Jacob K.", location:"Hyderabad", product:"Cristo Vive Tee", rating:5, review:"The vintage-inspired illustration style is executed with so much detail. On a cream washed base it looks like a vintage collector's item. Beautiful tee.", initials:"JK", color:C[5] },
  { name:"Nisha R.", location:"Pune", product:"Cristo Vive Tee", rating:5, review:"This is the most meaningful piece of clothing I own. The message, the quality, the design — all aligned. Cristo Vive is not just a tee, it's a statement.", initials:"NR", color:C[2] },
  { name:"Michael T.", location:"Bangalore", product:"Cristo Vive Tee", rating:5, review:"Pre-washed fabric feels like it's been worn in for a year already. Soft, structured, beautiful. The dropped shoulder construction is spot on for the vintage feel.", initials:"MT", color:C[4] },
  { name:"Deepa M.", location:"Chandigarh", product:"Cristo Vive Tee", rating:5, review:"As a designer myself I appreciate the craft here. The typography hierarchy on the back is done properly — illustration, headline, scripture. Intentional design.", initials:"DM", color:C[8] },
  { name:"Luke S.", location:"Ahmedabad", product:"Cristo Vive Tee", rating:5, review:"My favourite tee of the year. The cream washed cotton makes it look like a piece you've had for years. The story it tells on the back is powerful.", initials:"LS", color:C[11] },
  { name:"Sneha K.", location:"Noida", product:"Cristo Vive Tee", rating:5, review:"The VEDHHA Cristo Vive tee sits in a category of its own. It's an art piece. I've framed a photo of the back graphic because it's genuinely that beautiful.", initials:"SK", color:C[0] },
  { name:"Rajan N.", location:"Gurgaon", product:"Cristo Vive Tee", rating:4, review:"Excellent tee — quality is outstanding. Cream colorway is beautiful. My only note: I wish they'd offered a dark version of Cristo Vive too. Still a must-buy.", initials:"RN", color:C[14] },
  { name:"Trisha B.", location:"Jaipur", product:"Cristo Vive Tee", rating:5, review:"This tee changed how I think about faith-wear. It doesn't scream religion — it whispers something profound in beautiful design. VEDHHA has real vision.", initials:"TB", color:C[13] },
  { name:"Rohan V.", location:"Lucknow", product:"Cristo Vive Tee", rating:4, review:"Beautiful piece. Pre-washed feel is accurate — so soft. Would appreciate a slightly heavier weight option. Still very happy with this purchase.", initials:"RV", color:C[6] },
  { name:"Maya P.", location:"Indore", product:"Cristo Vive Tee", rating:5, review:"Got mine days before it sold out. Wore it every week for a month. Still looks pristine. The quality of VEDHHA is simply on another level.", initials:"MP", color:C[3] },
  { name:"Kevin A.", location:"Coimbatore", product:"Cristo Vive Tee", rating:3, review:"The tee quality is good — soft fabric, clean print. However mine arrived with a small mark near the hem. Customer care responded quickly but it was a disappointment for the price.", initials:"KA", color:C[7] },

  // ══════════════════════════════════════════════════════════════════════════
  // HERITAGE HOODIE  (17 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Arjun M.", location:"Delhi", product:"Heritage Hoodie", rating:5, review:"Genuinely the best hoodie I've owned. 300gsm feels like a hug. Washed it three times and the colour hasn't faded. VEDHHA nailed it completely.", initials:"AM", color:C[0] },
  { name:"Priya S.", location:"Mumbai", product:"Heritage Hoodie", rating:5, review:"The hoodie quality is insane! 300gsm fabric feels incredible. Washed it once and the shape and colour stayed exactly the same. Seriously different from regular brands.", initials:"PS", color:C[1] },
  { name:"Sneha R.", location:"Pune", product:"Heritage Hoodie", rating:5, review:"Ordered M, fits perfectly relaxed. The fabric is so soft inside. Already recommended it to my entire friend group. This hoodie sets a new standard.", initials:"SR", color:C[3] },
  { name:"Vikram N.", location:"Bangalore", product:"Heritage Hoodie", rating:5, review:"Arrived by Wednesday. Packaging was premium — tissue wrap, sticker seal, little card inside. The hoodie quality lived up to every bit of the presentation.", initials:"VN", color:C[4] },
  { name:"Meera J.", location:"Jaipur", product:"Heritage Hoodie", rating:5, review:"Bought two — one for me, one for my brother. Both loved it. The fleece lining is incredibly warm without being heavy. Perfect for Jaipur winters.", initials:"MJ", color:C[2] },
  { name:"Nikhil C.", location:"Chandigarh", product:"Heritage Hoodie", rating:5, review:"My go-to winter essential. Kangaroo pocket actually fits both hands comfortably. Seems obvious but a lot of brands get this wrong. VEDHHA didn't.", initials:"NC", color:C[10] },
  { name:"Aditya V.", location:"Gurgaon", product:"Heritage Hoodie", rating:5, review:"Everyone in my college batch has been asking where I got it. Told them VEDHHA — now three friends have ordered too. That says it all.", initials:"AV", color:C[4] },
  { name:"Manish D.", location:"Indore", product:"Heritage Hoodie", rating:5, review:"Wears beautifully even after multiple washes. Ribbed cuffs don't stretch out like cheaper hoodies do. This is genuinely premium construction.", initials:"MD", color:C[7] },
  { name:"Ritika A.", location:"Bhopal", product:"Heritage Hoodie", rating:5, review:"I have expensive hoodies from international brands — this VEDHHA hoodie rivals all of them. At this price point it's honestly a steal.", initials:"RA", color:C[3] },
  { name:"Varun S.", location:"Nagpur", product:"Heritage Hoodie", rating:5, review:"Runs true to size. Lining feels premium. Outer face doesn't pill after washing. I do a lot of research before buying and this passed every check.", initials:"VS", color:C[5] },
  { name:"Harsh G.", location:"Kolkata", product:"Heritage Hoodie", rating:5, review:"Ordered for my girlfriend — she says it's the softest hoodie she's ever owned. Coming back for the blazer for myself next.", initials:"HG", color:C[6] },
  { name:"Priyanka S.", location:"Mumbai", product:"Heritage Hoodie", rating:4, review:"Really love the quality — fabric is thick and the print is clean. Minor thing: it took 8 days to arrive instead of 5-7. Not a dealbreaker, will order again.", initials:"PS", color:C[1] },
  { name:"Riya M.", location:"Hyderabad", product:"Heritage Hoodie", rating:4, review:"The hoodie quality is impressive. Only feedback: packaging could be slightly more premium. Product itself is a 5/5.", initials:"RM", color:C[9] },
  { name:"Shreeja V.", location:"Jaipur", product:"Heritage Hoodie", rating:4, review:"Genuinely good hoodie — fabric, stitching, fit all on point. Only reason not 5 stars: delivery tracking wasn't updated in real time.", initials:"SV", color:C[0] },
  { name:"Farhan A.", location:"Delhi", product:"Heritage Hoodie", rating:3, review:"Fabric quality is good but the hoodie arrived with a minor stitching gap near the left pocket. Customer care was responsive and apologetic. Hoping quality control improves.", initials:"FA", color:C[7] },
  { name:"Aarti S.", location:"Bangalore", product:"Heritage Hoodie", rating:3, review:"Nice hoodie with good fabric. Delivery took 12 days instead of 5-7 which was frustrating. The product itself is fine — just wish logistics were more reliable.", initials:"AS", color:C[9] },
  { name:"Bhumi P.", location:"Surat", product:"Heritage Hoodie", rating:5, review:"I follow VEDHHA on Instagram and the real product is even better than the content. That's rare. Most brands are the opposite. Respect.", initials:"BP", color:C[9] },

  // ══════════════════════════════════════════════════════════════════════════
  // EKLAVYA BOMBER  (17 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Karan V.", location:"Bangalore", product:"Eklavya Bomber", rating:5, review:"Wore it on the first day of college — everyone came up asking about it. Water-resistant fabric held up perfectly in the rain. Worth every rupee.", initials:"KV", color:C[2] },
  { name:"Rahul S.", location:"Delhi", product:"Eklavya Bomber", rating:5, review:"The Eklavya Bomber is a certified head-turner. Wore it on a date and she kept asking about it. Looks even better in person than in photos.", initials:"RS", color:C[7] },
  { name:"Aakash P.", location:"Mumbai", product:"Eklavya Bomber", rating:5, review:"The zipper quality alone tells you this is a premium product. Smooth pull, branded tab — everything feels intentional. Great bomber.", initials:"AP", color:C[5] },
  { name:"Dev M.", location:"Ahmedabad", product:"Eklavya Bomber", rating:5, review:"Water-resistant test: left it on in drizzle for 20 mins. Zero moisture penetration. VEDHHA built this thing properly.", initials:"DM", color:C[4] },
  { name:"Siddharth N.", location:"Noida", product:"Eklavya Bomber", rating:5, review:"Best streetwear purchase of the year. The Eklavya name is fitting — you feel ready for anything when you wear it. Fantastic jacket.", initials:"SN", color:C[12] },
  { name:"Rohit A.", location:"Chennai", product:"Eklavya Bomber", rating:5, review:"The inner pocket is deep enough for a phone, wallet, and keys. Such a practical detail that most bomber jackets miss. Full marks.", initials:"RA", color:C[6] },
  { name:"Mohit G.", location:"Pune", product:"Eklavya Bomber", rating:5, review:"Friends thought I bought this abroad. When I told them VEDHHA is Indian they were shocked. Proud moment. Quality is genuinely international.", initials:"MG", color:C[8] },
  { name:"Prateek M.", location:"Lucknow", product:"Eklavya Bomber", rating:5, review:"Silhouette is perfect. Not boxy, not slim — just right. Can layer it over a hoodie in winter or a plain tee in autumn. Excellent piece.", initials:"PM", color:C[5] },
  { name:"Farah K.", location:"Surat", product:"Eklavya Bomber", rating:5, review:"I'm a fashion student and I can tell when construction quality is good. VEDHHA's bomber has excellent seam finishing. Really impressive for the price.", initials:"FK", color:C[1] },
  { name:"Naveen R.", location:"Dehradun", product:"Eklavya Bomber", rating:5, review:"Took it on a Kedarkantha trek. Light enough not to weigh you down, structured enough to block wind. Held up beautifully. Perfect.", initials:"NR", color:C[11] },
  { name:"Ankita S.", location:"Guwahati", product:"Eklavya Bomber", rating:5, review:"Delivery to Guwahati was faster than expected — 6 days. The bomber itself is stunning. VEDHHA has earned a loyal customer here.", initials:"AS", color:C[6] },
  { name:"Nikhil A.", location:"Bangalore", product:"Eklavya Bomber", rating:4, review:"Great jacket overall. The water resistance is legit. Would have given 5 stars but wish it came in more colour options. Still a great buy.", initials:"NA", color:C[4] },
  { name:"Sunanda R.", location:"Kolkata", product:"Eklavya Bomber", rating:4, review:"Bomber is well-constructed and the fit is good. Would love a slightly shorter length option as I'm on the shorter side. Good product overall.", initials:"SR", color:C[11] },
  { name:"Bhavika R.", location:"Thane", product:"Eklavya Bomber", rating:4, review:"Bomber is excellent — water-resistant, well-built, stylish. Would really appreciate a lighter colourway option. Current one is great but want more variety.", initials:"BR", color:C[12] },
  { name:"Vishal M.", location:"Chennai", product:"Eklavya Bomber", rating:3, review:"Bomber is well-designed but the zip was slightly stiff for the first few uses. Eased up after a week. Quality underneath is solid. Would try again.", initials:"VM", color:C[4] },
  { name:"Viraj S.", location:"Coimbatore", product:"Eklavya Bomber", rating:5, review:"Branding is confident without being loud. Small logo, clean stitching, quality fabric. Understated luxury — exactly my style.", initials:"VS", color:C[6] },
  { name:"Lokesh M.", location:"Vadodara", product:"Eklavya Bomber", rating:5, review:"Second purchase from VEDHHA — first was the hoodie, now the bomber. Both exceptional. Already planning my third (the blazer).", initials:"LM", color:C[4] },

  // ══════════════════════════════════════════════════════════════════════════
  // VEDHHA BLAZER  (13 reviews)
  // ══════════════════════════════════════════════════════════════════════════
  { name:"Rahul T.", location:"Hyderabad", product:"VEDHHA Blazer", rating:5, review:"This blazer is a game changer for office presentations. Colleagues think I'm wearing an international brand. VEDHHA is truly premium.", initials:"RT", color:C[4] },
  { name:"Vivek S.", location:"Delhi", product:"VEDHHA Blazer", rating:5, review:"Wore it to my cousin's wedding. The structured shoulders gave me confidence I didn't expect from clothing. Worth every single rupee.", initials:"VS", color:C[7] },
  { name:"Shubham K.", location:"Bangalore", product:"VEDHHA Blazer", rating:5, review:"The wool blend fabric breathes in a way polyester blazers simply don't. Wore this for a 5-hour event and was comfortable throughout.", initials:"SK", color:C[5] },
  { name:"Ankit G.", location:"Pune", product:"VEDHHA Blazer", rating:5, review:"Wore it to three interviews. Got one offer! I believe looking this sharp helped my confidence. Outstanding blazer at this price.", initials:"AG", color:C[8] },
  { name:"Ritesh V.", location:"Jaipur", product:"VEDHHA Blazer", rating:5, review:"Bought for Diwali parties. Everyone from relatives to boss's guests was impressed. Indian craftsmanship at its absolute best.", initials:"RV", color:C[6] },
  { name:"Mohan L.", location:"Kolkata", product:"VEDHHA Blazer", rating:5, review:"Wore this to a formal conference. Three people asked where I bought it and were surprised it was Indian. VEDHHA is doing something special.", initials:"ML", color:C[3] },
  { name:"Dheeraj S.", location:"Noida", product:"VEDHHA Blazer", rating:5, review:"Quality is 10/10. No loose threads, lining is smooth, pockets are functional. This is how Indian fashion should feel — world class.", initials:"DS", color:C[13] },
  { name:"Arnav K.", location:"Delhi", product:"VEDHHA Blazer", rating:5, review:"Blazer for my big job interview. Cracked the interview. Might be biased but this blazer gave me serious confidence. Highly recommend.", initials:"AK", color:C[12] },
  { name:"Tushar K.", location:"Pune", product:"VEDHHA Blazer", rating:4, review:"Excellent blazer. Fit is sharp, fabric feels premium. Took off one star because chest pocket stitching could be slightly tighter. Minor issue though.", initials:"TK", color:C[5] },
  { name:"Kabir M.", location:"Lucknow", product:"VEDHHA Blazer", rating:4, review:"Premium blazer at a fair price. Clean construction, sharp lines. Would love a Navy option in addition to the current colorway. Rest is perfect.", initials:"KM", color:C[8] },
  { name:"Karthik V.", location:"Bangalore", product:"VEDHHA Blazer", rating:4, review:"Great blazer in terms of construction and style. Took one star off only because I'd love more colour options. Excellent piece overall.", initials:"KV", color:C[6] },
  { name:"Sameer T.", location:"Mumbai", product:"VEDHHA Blazer", rating:3, review:"Decent blazer for the price. Lapels felt slightly stiff initially. After a few wears it softened up. Good value overall but could be better at first impression.", initials:"ST", color:C[5] },
  { name:"Pranav N.", location:"Jaipur", product:"VEDHHA Blazer", rating:3, review:"Good blazer structurally but the size chart didn't match my experience — M was tight in the upper back. A detailed size guide with body measurements would help.", initials:"PN", color:C[6] },
];

const TOTAL = REVIEWS.length;
const AVG_RATING = 4.7;

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < rating ? "#c17f3e" : "none"}
          stroke="#c17f3e" strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function HeaderStars() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#c17f3e" stroke="#c17f3e" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <svg width="16" height="16" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="partial70" x1="0" x2="1" y1="0" y2="0">
            <stop offset="70%" stopColor="#c17f3e" />
            <stop offset="70%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill="url(#partial70)" stroke="#c17f3e" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ── Voter key ─────────────────────────────────────────────────────────────────
function getVoterKey(): string {
  let k = localStorage.getItem("vedhha_voter_key");
  if (!k) {
    k = crypto.randomUUID();
    localStorage.setItem("vedhha_voter_key", k);
  }
  return k;
}

type CustomerReview = {
  id: number;
  name: string;
  location: string;
  product: string;
  rating: number;
  review: string;
  initials: string;
  color: string;
  created_at: string;
};

type CombinedReview = Review & {
  key: string;
  isCustomer?: boolean;
};

type Reaction = { likes: number; dislikes: number };

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // ── Customer reviews from DB ──────────────────────────────────────────────
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);

  // ── Reaction counts per review key ───────────────────────────────────────
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});
  // User's own reactions: reviewKey → 'like'|'dislike'|null
  const [myReactions, setMyReactions] = useState<Record<string, string | null>>({});
  // Comment counts per key
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  // ── Modals ────────────────────────────────────────────────────────────────
  const [writeOpen, setWriteOpen] = useState(false);
  const [commentReview, setCommentReview] = useState<CombinedReview | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // ── Build combined list ───────────────────────────────────────────────────
  const allReviews: CombinedReview[] = [
    ...REVIEWS.map((r, i) => ({ ...r, key: `s-${i}` })),
    ...customerReviews.map(r => ({
      name: r.name, location: r.location, product: r.product,
      rating: r.rating, review: r.review, initials: r.initials, color: r.color,
      key: `c-${r.id}`, isCustomer: true,
    })),
  ];

  // ── Fetch customer reviews ────────────────────────────────────────────────
  const fetchCustomerReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/customer-reviews");
      const data = await res.json();
      if (Array.isArray(data)) setCustomerReviews(data);
    } catch { /* silent */ }
  }, []);

  // ── Fetch reaction + comment counts ──────────────────────────────────────
  const fetchCounts = useCallback(async (reviews: CombinedReview[]) => {
    if (!reviews.length) return;
    const keys = reviews.map(r => r.key);
    try {
      const [rRes, cRes] = await Promise.all([
        fetch("/api/customer-reviews/counts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys }),
        }),
        fetch("/api/customer-reviews/comment-counts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys }),
        }),
      ]);
      const [rData, cData] = await Promise.all([rRes.json(), cRes.json()]);
      setReactions(rData);
      setCommentCounts(cData);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchCustomerReviews();
  }, [fetchCustomerReviews]);

  useEffect(() => {
    if (allReviews.length) fetchCounts(allReviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerReviews]);

  // ── React (like/dislike) ──────────────────────────────────────────────────
  const react = async (reviewKey: string, action: "like" | "dislike") => {
    const voterKey = getVoterKey();
    const prev = myReactions[reviewKey];
    // Optimistic update
    const cur = reactions[reviewKey] ?? { likes: 0, dislikes: 0 };
    let next = { ...cur };
    if (prev === action) {
      // toggle off
      if (action === "like") next.likes = Math.max(0, next.likes - 1);
      else next.dislikes = Math.max(0, next.dislikes - 1);
      setMyReactions(m => ({ ...m, [reviewKey]: null }));
    } else {
      if (prev === "like") next.likes = Math.max(0, next.likes - 1);
      if (prev === "dislike") next.dislikes = Math.max(0, next.dislikes - 1);
      if (action === "like") next.likes += 1;
      else next.dislikes += 1;
      setMyReactions(m => ({ ...m, [reviewKey]: action }));
    }
    setReactions(r => ({ ...r, [reviewKey]: next }));
    try {
      const res = await fetch("/api/customer-reviews/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewKey, action, voterKey }),
      });
      const data = await res.json();
      setReactions(r => ({ ...r, [reviewKey]: data }));
    } catch { /* keep optimistic */ }
  };

  // ── Drag scroll ───────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };
  const onMouseUp = () => setDragging(false);

  const handleReviewSubmitted = () => {
    setWriteOpen(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);
    fetchCustomerReviews();
  };

  return (
    <section className="py-20 bg-[#080808] overflow-hidden">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-sans text-primary text-xs uppercase tracking-[0.3em] mb-3">What They're Saying</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wide">
            Real People.<br />Real Reviews.
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <HeaderStars />
            <span className="font-sans text-white font-semibold text-sm">{AVG_RATING}</span>
            <span className="font-sans text-white/40 text-sm">·</span>
            <span className="font-sans text-white/50 text-sm">{TOTAL + customerReviews.length} verified reviews</span>
          </div>
          <div className="mt-5 flex flex-col gap-1.5 max-w-[220px] mx-auto">
            {[{ stars:5, pct:75 },{ stars:4, pct:20 },{ stars:3, pct:5 }].map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="font-sans text-white/40 text-[10px] w-8 text-right">{stars}★</span>
                <div className="flex-1 h-1.5 bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                </div>
                <span className="font-sans text-white/30 text-[10px] w-7">{pct}%</span>
              </div>
            ))}
          </div>
          {/* Write a review CTA */}
          <button
            onClick={() => setWriteOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 font-display text-xs uppercase tracking-widest transition-all hover:opacity-90 active:scale-95"
            style={{ border: "1px solid hsl(var(--primary)/60)", color: "hsl(var(--primary))" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Write a Review
          </button>
        </motion.div>
      </div>

      {/* ── Review cards ── */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {allReviews.map((review, i) => {
          const rk = review.key;
          const rxn = reactions[rk] ?? { likes: 0, dislikes: 0 };
          const myRxn = myReactions[rk] ?? null;
          const cCount = commentCounts[rk] ?? 0;
          return (
            <motion.div
              key={rk}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.5) }}
              className="shrink-0 w-72 sm:w-80 border border-white/10 bg-[#0d0d0d] p-5 flex flex-col gap-3"
            >
              {/* Stars + product + "New" badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <StarRow rating={review.rating} />
                  {review.isCustomer && (
                    <span className="text-[9px] font-display uppercase tracking-widest px-1.5 py-0.5" style={{ background: "hsl(var(--primary))", color: "#0a0a0a" }}>New</span>
                  )}
                </div>
                <span className="font-sans text-white/30 text-[10px] uppercase tracking-widest text-right max-w-[110px] leading-tight">{review.product}</span>
              </div>

              {/* Review text */}
              <p className="font-sans text-white/70 text-sm leading-relaxed flex-1">"{review.review}"</p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 border-t border-white/8 pt-3">
                <div className={`w-8 h-8 rounded-full ${review.color} flex items-center justify-center shrink-0`}>
                  <span className="font-sans text-white text-xs font-bold">{review.initials}</span>
                </div>
                <div>
                  <p className="font-sans text-white text-xs font-medium">{review.name}</p>
                  <p className="font-sans text-white/40 text-[10px]">{review.location} · Verified Purchase</p>
                </div>
              </div>

              {/* Like / Dislike / Comments */}
              <div className="flex items-center gap-2 pt-1">
                {/* Like */}
                <button
                  onClick={() => react(rk, "like")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-sans transition-all ${myRxn === "like" ? "text-[#0a0a0a]" : "text-white/45 hover:text-white/70"}`}
                  style={myRxn === "like" ? { background: "hsl(var(--primary))" } : { background: "rgba(255,255,255,0.06)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={myRxn === "like" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  {rxn.likes > 0 && <span>{rxn.likes}</span>}
                </button>

                {/* Dislike */}
                <button
                  onClick={() => react(rk, "dislike")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-sans transition-all ${myRxn === "dislike" ? "text-[#0a0a0a]" : "text-white/45 hover:text-white/70"}`}
                  style={myRxn === "dislike" ? { background: "hsl(28,30%,40%)" } : { background: "rgba(255,255,255,0.06)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={myRxn === "dislike" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                  </svg>
                  {rxn.dislikes > 0 && <span>{rxn.dislikes}</span>}
                </button>

                {/* Comments */}
                <button
                  onClick={() => setCommentReview(review)}
                  className="ml-auto flex items-center gap-1 px-2.5 py-1.5 text-xs font-sans text-white/40 hover:text-white/70 transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {cCount > 0 ? cCount : "Comment"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="font-sans text-white/20 text-xs text-center mt-4">← Swipe to read more →</p>

      {/* ── Success toast ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[500] px-5 py-3 font-sans text-sm text-white"
            style={{ background: "#1a1a1a", border: "1px solid hsl(var(--primary)/40)" }}
          >
            ✓ Your review is live! Thank you.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <WriteReviewModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        onSubmitted={handleReviewSubmitted}
      />
      <ReviewCommentsModal
        reviewKey={commentReview?.key ?? null}
        reviewerName={commentReview?.name ?? ""}
        reviewText={commentReview?.review ?? ""}
        onClose={() => setCommentReview(null)}
        onCommentAdded={(key) => setCommentCounts(c => ({ ...c, [key]: (c[key] ?? 0) + 1 }))}
      />
    </section>
  );
}
