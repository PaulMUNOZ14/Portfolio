document.addEventListener('DOMContentLoaded', () => {
  
  // Récupération des éléments du DOM
  const sidebarItems = document.querySelectorAll('#projects .sidebar-item');
  const projectPanes = document.querySelectorAll('.project-pane');
  const activeTabName = document.getElementById('active-tab-name');

  // Logique du Toggle des projets (Style Editeur de texte)
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      
      // 1. Retirer la classe 'active' de tous les éléments de la barre latérale
      sidebarItems.forEach(el => el.classList.remove('active'));
      
      // 2. Ajouter la classe 'active' à l'élément cliqué
      item.classList.add('active');
      
      // 3. Mettre à jour le nom dans l'onglet supérieur de l'éditeur
      const fileName = item.textContent.replace(/[🎮🌐🎨]/g, '').trim(); 
      activeTabName.textContent = fileName;

      // 4. Masquer tous les projets
      projectPanes.forEach(pane => pane.classList.remove('active'));

      // 5. Afficher le projet correspondant à l'attribut data-target
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

});