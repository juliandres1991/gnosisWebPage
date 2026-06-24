// evita inyección al mostrar el texto del .txt
export function escapeHtml(str){
  return String(str).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

export function renderMarkdown(md){
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];

  function inline(text){
    return escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function flushParagraph(){
    if(!paragraph.length) return;
    blocks.push('<p>' + inline(paragraph.join('\n')) + '</p>');
    paragraph = [];
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if(!trimmed){
      flushParagraph();
    }else if(trimmed === '---'){
      flushParagraph();
      blocks.push('<hr>');
    }else if(trimmed.startsWith('## ')){
      flushParagraph();
      blocks.push('<h2>' + inline(trimmed.replace(/^##\s+/, '')) + '</h2>');
    }else{
      paragraph.push(line);
    }
  });
  flushParagraph();
  return blocks.join('\n');
}


