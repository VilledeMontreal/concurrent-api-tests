Fonctionnalité: Gestion des branchements d'eau

  Le branchement d'eau est l'élément fondamental du système de Gestion des
  Branchements d'Eau (GBEau). Toutes les activités du système (rapports de
  conformité, inspections, dépistages, etc.) sont rattachées à un branchement.

  Cette fonctionnalité permet aux utilisateurs de créer, positionner, déplacer
  et supprimer des branchements d'eau sur le territoire de l'île de Montréal.

  Rôles du système:
  - Dépisteur: peut créer et déplacer des branchements
  - Inspecteur: peut créer et déplacer des branchements
  - Contremaître: peut créer, déplacer et supprimer des branchements

  Règle: Tout utilisateur autorisé peut créer un branchement d'eau

    Exemple: Création d'un branchement d'eau
      Quand un utilisateur crée un branchement d'eau à une position sur l'île de Montréal
      Alors le branchement d'eau est créé à cette position

  Règle: Tout utilisateur autorisé peut déplacer un branchement d'eau

    Lors de l'initialisation du système, les branchements d'eau ont été
    positionnés par défaut au centroïde de chaque bâtiment de Montréal.
    Lorsqu'un utilisateur, lors d'une intervention sur le terrain, constate
    l'emplacement réel d'un branchement d'eau, il met à jour la position
    dans GBEau afin d'améliorer progressivement la qualité des données
    de la Ville sur l'emplacement des branchements d'eau.

    Exemple: Déplacement d'un branchement d'eau
      Étant donné un branchement d'eau existant
      Quand un utilisateur déplace le branchement d'eau vers une nouvelle position
      Alors le branchement d'eau est repositionné à la nouvelle position

  Règle: Seul le contremaître peut supprimer un branchement d'eau

    Exemple: Le contremaître supprime un branchement d'eau
      Étant donné un branchement d'eau sans activités rattachées
      Quand le contremaître supprime le branchement d'eau
      Alors le branchement d'eau est supprimé

    Exemple: Un utilisateur non contremaître ne peut pas supprimer un branchement d'eau
      Étant donné un branchement d'eau sans activités rattachées
      Quand un dépisteur tente de supprimer le branchement d'eau
      Alors la suppression est refusée

  Règle: Un branchement d'eau avec des activités rattachées ne peut pas être supprimé

    Exemple: Impossible de supprimer un branchement avec des activités rattachées
      Étant donné un branchement d'eau avec des activités rattachées
      Quand le contremaître tente de supprimer le branchement d'eau
      Alors la suppression est refusée car le branchement a des activités rattachées
