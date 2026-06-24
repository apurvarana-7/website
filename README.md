# Apurva Rana — Marketing Portfolio

A website recreation of the Canva marketing portfolio: huge bold black headings, dark
heading chips, light layout, real imagery pulled from the source video, and a rebuilt
Instagram-style analytics dashboard. Pure HTML / CSS / JS, no build step.

## Make it yours
1. **`config.js`** — name, title, tagline, email, LinkedIn, Instagram handle.
2. **Resume** — drop your PDF at `assets/resume.pdf`.
3. **Images** live in `assets/img/` (already filled from the video). To swap any, keep the
   same file name: `hero.jpg`, `portrait.jpg`, `graphics1-2.jpg`, `reels1-2.jpg`,
   `brand1-4.jpg`, `igprofile.jpg`. Higher-resolution originals will look sharper than the
   video crops.
4. **Featured reel** — `assets/video/feature.mp4` (your uploaded clip). Replace anytime.
5. **Analytics numbers** are recreated as crisp HTML in `index.html` (the `.dash` section)
   and animate on scroll — edit the `data-count` values and labels to update them.

## Sections (matches the Canva deck order)
Hero → About Me → My Education → Work Experience (Graphics) → Reels and Videos →
Brand Collaborations → Content Creator & Personal Brand → Social Media Growth & Analytics →
Contact.

## Preview locally
```
cd Desktop/marketing-portfolio
python -m http.server 8010
```
Open http://localhost:8010

## Deploy (free)
- **Netlify** — drag the `marketing-portfolio` folder onto https://app.netlify.com/drop.
- **GitHub Pages** — push to a repo, Settings → Pages → `main` / root.
- **Vercel** — `npx vercel` in this folder.

The contact form opens the visitor's email app pre-filled to your address, so it works on any
static host with no setup.
