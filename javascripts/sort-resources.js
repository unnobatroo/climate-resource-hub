// Automatically sort resource cards alphabetically within each section
document.addEventListener('DOMContentLoaded', function() {
  const kanbanColumns = document.querySelectorAll('.kanban-column');
  
  kanbanColumns.forEach(column => {
    // Get all resource card links in this column
    const cards = Array.from(column.querySelectorAll('a.resource-card-link'));
    
    if (cards.length === 0) return;
    
    // Extract title from each card and sort
    const sortedCards = cards.sort((a, b) => {
      const getTitleText = (card) => {
        const h4 = card.querySelector('h4');
        if (!h4) return '';
        // Get text content and remove emojis/HTML
        const text = h4.textContent.trim();
        return text.toLowerCase();
      };
      
      const titleA = getTitleText(a);
      const titleB = getTitleText(b);
      
      return titleA.localeCompare(titleB);
    });
    
    // Reorder the cards in the DOM
    const container = cards[0].parentElement;
    sortedCards.forEach(card => {
      container.appendChild(card);
    });
  });
});
