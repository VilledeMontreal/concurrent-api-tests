Fonctionnalité: Consultation des arrondissements
  Le système GBEau permet aux utilisateurs de consulter la liste des arrondissements
  de la ville de Montréal. Cette fonctionnalité est essentielle pour associer
  les branchements d'eau à leur arrondissement correspondant.

  La ville compte 19 arrondissements officiels. Un arrondissement spécial "Inconnue"
  existe pour traiter les cas exceptionnels où un branchement d'eau est remplacé
  dans une ville liée. Cet arrondissement est accessible uniquement aux contremaîtres.

  Règle: La liste des arrondissements est triée en ordre alphabétique

    Exemple: Lister tous les arrondissements
      Quand un utilisateur liste tous les arrondissements
      Alors le premier arrondissement de la liste est "Ahuntsic - Cartierville"

  Règle: La recherche par nom est insensible à la casse

    Plan du scénario: Rechercher un arrondissement par nom partiel
      Quand un utilisateur recherche les arrondissements avec "<critère>"
      Alors seul l'arrondissement "Ahuntsic - Cartierville" est retourné

      Exemples:
        | critère |
        | Cart    |
        | cart    |

  Règle: Seul le contremaître a accès à l'arrondissement "Inconnue"

    Exemple: Le contremaître voit l'arrondissement "Inconnue"
      Étant donné un utilisateur avec le rôle "contremaître"
      Quand il liste tous les arrondissements
      Alors 20 arrondissements sont retournés
      Et l'arrondissement "Inconnue" est présent dans la liste

    Plan du scénario: Les autres rôles ne voient pas l'arrondissement "Inconnue"
      Étant donné un utilisateur avec le rôle "<rôle>"
      Quand il liste tous les arrondissements
      Alors 19 arrondissements sont retournés
      Et l'arrondissement "Inconnue" n'est pas présent dans la liste

      Exemples:
        | rôle       |
        | dépisteur  |
        | inspecteur |

    Plan du scénario: Les autres rôles ne trouvent pas l'arrondissement "Inconnue" par recherche
      Étant donné un utilisateur avec le rôle "<rôle>"
      Quand il recherche les arrondissements avec "Inconnue"
      Alors aucun arrondissement n'est retourné

      Exemples:
        | rôle       |
        | dépisteur  |
        | inspecteur |
