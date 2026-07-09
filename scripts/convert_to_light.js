const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    // using split join to replace all occurrences
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
};

const pathwayPath = path.join(__dirname, '../src/app/pathway/page.tsx');
const adminPath = path.join(__dirname, '../src/app/admin/page.tsx');

const commonReplacements = [
  ['bg-[#0A0A0B]', 'bg-slate-50'],
  ['bg-[#0A0A0C]', 'bg-slate-50'],
  ['text-slate-200', 'text-slate-800'],
  ['text-slate-300', 'text-slate-600'],
  ['text-slate-400', 'text-slate-500'],
  ['text-white', 'text-slate-900'],
  ['bg-white/5', 'bg-white'],
  ['bg-white/10', 'bg-slate-100'],
  ['border-white/10', 'border-slate-200'],
  ['border-white/5', 'border-slate-200'],
  ['bg-black/20', 'bg-slate-100'],
  ['bg-black/50', 'bg-white'],
  ['bg-black/95', 'bg-slate-50'],
  ['border-cyan-900/50', 'border-slate-300'],
  ['text-cyan-50', 'text-slate-900'],
  ['text-cyan-400', 'text-cyan-600'],
  ['text-cyan-500/70', 'text-cyan-700/70'],
  ['bg-cyan-500/10', 'bg-cyan-100'],
  ['border-cyan-500/30', 'border-cyan-300'],
  ['text-fuchsia-400', 'text-fuchsia-600'],
  ['bg-slate-900/40', 'bg-white'],
  ['border-slate-700/50', 'border-slate-200'],
  ['text-emerald-400', 'text-emerald-600'],
  ['text-emerald-300', 'text-emerald-600'],
  ['bg-emerald-500/10', 'bg-emerald-50'],
  ['border-emerald-500/20', 'border-emerald-200'],
  ['text-purple-400', 'text-purple-600'],
  ['text-purple-300', 'text-purple-600'],
  ['bg-purple-500/10', 'bg-purple-50'],
  ['border-purple-500/20', 'border-purple-200'],
  ['mix-blend-screen', ''],
  ['opacity-[0.03]', 'opacity-[0.01]'], // Lighten the noise
  ['hover:bg-white/10', 'hover:bg-slate-50'],
  ['placeholder:text-slate-600', 'placeholder:text-slate-400'],
  ['bg-indigo-600/10', 'bg-indigo-100/50'],
  ['bg-purple-600/10', 'bg-purple-100/50'],
  ['from-cyan-400 to-fuchsia-400', 'from-cyan-600 to-fuchsia-600'],
  ['from-indigo-400 via-purple-400 to-emerald-400', 'from-indigo-600 via-purple-600 to-emerald-600'],
  ['text-red-400', 'text-red-600'],
  ['text-red-300', 'text-red-600'],
  ['bg-red-500/10', 'bg-red-50'],
  ['border-red-500/20', 'border-red-200'],
];

replaceInFile(pathwayPath, commonReplacements);
replaceInFile(adminPath, commonReplacements);

console.log('Converted both pages to Light Mode!');
