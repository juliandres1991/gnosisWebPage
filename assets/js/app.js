import { defaultLanguage, loadTranslations, salmosFiles } from './content.js';
import { escapeHtml, renderMarkdown } from './markdown.js';

let currentLang = defaultLanguage;
let currentViewKey = 'home';
let translations = {};
let fallbackTranslations = {};

function t(key){
  return translations[key] || fallbackTranslations[key] || '';
}

function renderTxtFallback(container, file, lang){
  const message = t('local_file_notice');
  container.innerHTML = '<p class="notice">' + escapeHtml(message) + '</p>' +
    '<iframe class="txt-fallback" title="Psalms text" src="' + encodeURI(file) + '"></iframe>';
}

// carga el archivo correspondiente y lo formatea en parrafos
async function loadSalmos(lang){
  const file = salmosFiles[lang] || salmosFiles.en;
  const container = document.getElementById('salmosContent');
  if(!container) return;
  // texto de fallback mientras carga
  container.textContent = t('salmos_content');
  try{
    const res = await fetch(file);
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const md = await res.text();
    container.innerHTML = renderMarkdown(md);
  }catch(err){
    console.warn('No se pudo cargar', file, err);
    renderTxtFallback(container, file, lang);
  }
}

async function setLanguage(lang){
  currentLang = lang;
  if(!Object.keys(fallbackTranslations).length){
    fallbackTranslations = await loadTranslations(defaultLanguage);
  }
  translations = await loadTranslations(lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    // no sobrescribir el contenedor donde insertamos el texto cargado
    if(key === 'salmos_content') return;
    const value = t(key);
    if(value) el.textContent = value;
  });
  document.querySelectorAll('.lang-switch button[data-lang]').forEach(button=>{
    button.classList.toggle('active', button.dataset.lang === lang);
  });
  // carga el archivo .txt correspondiente
  await loadSalmos(lang);
  updateCurrentViewName();
}

function updateCurrentViewName(){
  const currentViewName = document.getElementById('currentViewName');
  if(!currentViewName) return;
  currentViewName.textContent = t(currentViewKey);
}

function showSection(section, activeSection){
  const sectionEl = document.getElementById(section);
  if(!sectionEl) return;
  document.querySelectorAll('.section').forEach(s=>s.style.display='none');
  sectionEl.style.display = 'block';

  const navSection = activeSection || section;
  document.querySelectorAll('nav a, .submenu-toggle[data-section]').forEach(x=>{
    x.classList.toggle('active', x.dataset.section === navSection);
  });
  const navLink = document.querySelector(`nav a[data-section="${section}"], .submenu-toggle[data-section="${section}"]`) || document.querySelector(`nav a[data-section="${navSection}"], .submenu-toggle[data-section="${navSection}"]`);
  document.querySelectorAll('.nav-group').forEach(group=>{
    const isActiveGroup = navLink ? group.contains(navLink) : false;
    const toggle = group.querySelector('.submenu-toggle');
    if(isActiveGroup) group.classList.add('open');
    if(toggle){
      toggle.classList.toggle('active-parent', isActiveGroup);
      toggle.setAttribute('aria-expanded', String(group.classList.contains('open')));
    }
  });

  const title = sectionEl.querySelector('h1[data-i18n]');
  currentViewKey = title?.getAttribute('data-i18n') || navLink?.getAttribute('data-i18n') || 'home';
  updateCurrentViewName();
  window.scrollTo({top:0, behavior:'smooth'});
}

// Menu handling
document.querySelectorAll('.submenu-toggle').forEach(button=>{
  button.addEventListener('click', ()=>{
    const group = button.closest('.nav-group');
    if(!group) return;
    if(button.dataset.section){
      const wasOpen = group.classList.contains('open');
      showSection(button.dataset.section);
      if(wasOpen){
        group.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
      return;
    }
    group.classList.toggle('open');
    button.setAttribute('aria-expanded', String(group.classList.contains('open')));
  });
});

document.querySelectorAll('[data-section-link]').forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    showSection(link.dataset.sectionLink);
    if(window.innerWidth<=900) {
      document.getElementById('sidebar').classList.remove('visible');
      document.body.classList.remove('menu-open');
    }
  });
});

document.querySelectorAll('nav a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    showSection(a.dataset.section);
    // hide sidebar on mobile
    if(window.innerWidth<=900) {
      document.getElementById('sidebar').classList.remove('visible');
      document.body.classList.remove('menu-open');
    }
  });
});

// language buttons
document.querySelectorAll('.lang-switch button[data-lang]').forEach(button=>{
  button.addEventListener('click', ()=>{ void setLanguage(button.dataset.lang); });
});

// hamburger for mobile
document.getElementById('hambBtn').addEventListener('click', ()=>{
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('visible');
  document.body.classList.toggle('menu-open', sidebar.classList.contains('visible'));
});

document.getElementById('closeMenu').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.remove('visible');
  document.body.classList.remove('menu-open');
});

// set year
document.getElementById('year').textContent = new Date().getFullYear();

// init
await setLanguage(defaultLanguage);
showSection('home');
