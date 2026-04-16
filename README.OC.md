# 🏥 DataSoluTech : Migration & Scalabilité de Données Médicales

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge\&logo=docker\&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge\&logo=python\&logoColor=ffdd54)

---

## ---Contexte du Projet---

Ce projet s'inscrit dans le cadre d'une mission pour **DataSoluTech**.
Un établissement médical rencontre des problèmes de **scalabilité** avec ses données patients actuellement stockées en CSV.

L’objectif est de mettre en place une solution **Big Data scalable horizontalement** en :

* migrant les données vers **MongoDB (NoSQL)**
* conteneurisant l’application avec **Docker**
* préparant un futur déploiement sur le **Cloud (AWS)**

---

## --- Architecture & Technologies---

L’infrastructure repose sur **Docker Compose** avec plusieurs conteneurs :

*  **Base de données :** MongoDB (`mongo:7`)
*  **Application :** script Python de migration
*  **Volumes :**

  * données CSV liées au conteneur Python
  * volume persistant `mongo_data` pour MongoDB

---

##  ---Lancer le projet en local---

### 1. Cloner le repo

```bash
git clone https://github.com/YAD95/DataSoluTech-Migration-MongoDB.git
cd DataSoluTech-Migration-MongoDB
```

### 2. Préparer le fichier d’environnement

Avant de lancer Docker, il faut d’abord utiliser le fichier d’exemple fourni dans le dépôt.

```bash
cp .env.example .env
```

Ensuite, modifiez le fichier `.env` avec vos propres identifiants :

```env
MONGO_ROOT_USER=admin_medical
MONGO_ROOT_PASSWORD=your_secure_password
```

👉 Cette étape est obligatoire pour que Docker puisse injecter correctement les variables dans l’infrastructure.

### 3. Lancer l’infrastructure

```bash
docker compose up --build
```

Cette commande :

* télécharge les images
* configure la base de données
* applique les variables d’environnement
* crée automatiquement les rôles MongoDB
* lance le script de migration
* importe les données patients dans **MedicalDB**

### 4. Vérifier les données

Via MongoDB Compass avec une URI du type :

```bash
mongodb://<MONGO_ROOT_USER>:<MONGO_ROOT_PASSWORD>@localhost:27018/
```

Les identifiants ne sont plus écrits en dur dans le README ni dans le `docker-compose.yml`.
Ils sont maintenant **masqués via des variables d’environnement**.

### 5. Nettoyer l’environnement (reset complet)

```bash
docker compose down -v
```

---

## ---Logique du script de migration---

Le fichier `code_migration.py` réalise un processus ETL :

* **Connexion intelligente :**

  * détection Docker / local via `os.getenv`

* **Idempotence :**

  * suppression des anciennes données avant réinsertion

* **Extraction :**

  * lecture du fichier CSV avec Pandas

* **Transformation & Nettoyage :**

  * suppression des doublons
  * formatage du texte
  * conversion des dates avec Pandas
  * conversion en dictionnaires JSON

* **Chargement & Optimisation :**

  * insertion dans MongoDB (`Patients`)
  * création d’index sur `Name` et `Date of Admission` pour accélérer les requêtes

* **Tests automatisés :**

  * **Test 1 — Volumétrie :** vérification du nombre total de documents insérés
  * **Test 2 — Unicité :** vérification qu’il n’existe aucun doublon d’identifiants (`_id`)
  * **Test 3 — Qualité :** vérification qu’aucun document n’a de valeur manquante sur les champs critiques `Name` et `Age`

---

## ---Sécurité & Authentification---

###  Gestion des mots de passe

* Les identifiants MongoDB sont injectés via des **variables d’environnement**
* Le fichier `docker-compose.yml` appelle désormais ces variables au lieu d’exposer les secrets en clair
* Aucun mot de passe sensible ne doit être envoyé sur GitHub
* Le vrai fichier `.env` est bloqué par le fichier `.gitignore`
* Seul le fichier `.env.example` est versionné pour fournir une base de configuration

###  Gestion des rôles (RBAC)

Le projet met désormais en place une gestion des accès par rôles :

* **`admin_medical`** : rôle **Root** configuré via le fichier `.env`
* **`data_engineer`** : rôle avec droits **`readWrite`** sur la base **MedicalDB**
* **`data_reader`** : rôle avec droits **`read`** sur la base **MedicalDB**

👉 Les rôles **`data_engineer`** et **`data_reader`** sont créés automatiquement au démarrage grâce au script **`init-mongo.js`**.

---

## ---Schéma des données (collection Patients)---

| Champ | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Identifiant unique généré par MongoDB |
| `Name` | String | Nom du patient |
| `Age` | Integer | Âge |
| `Gender` | String | Genre |
| `Blood Type` | String | Groupe sanguin |
| `Medical Condition` | String | Pathologie (ex: Cancer, Asthma) |
| `Date of Admission` | Date | Date d'entrée (format ISO) |
| `Doctor` | String | Médecin en charge |
| `Hospital` | String | Hôpital |
| `Insurance Provider` | String | Assurance |
| `Billing Amount` | Double | Montant de la facture |
| `Room Number` | Integer | Numéro de la chambre |
| `Admission Type` | String | Type d'admission |
| `Discharge Date` | Date | Date de sortie (format ISO) |
| `Medication` | String | Traitement prescrit |
| `Test Results` | String | Résultat des examens |

---

##  ---Points clés du projet---

* Migration de données CSV vers MongoDB
* Pipeline ETL automatisé avec Python
* Conteneurisation avec Docker Compose
* Sécurisation des credentials avec `.env`
* Protection des secrets avec `.gitignore`
* Gestion des rôles MongoDB avec **RBAC**
* Création automatique des utilisateurs via `init-mongo.js`
* Contrôles de qualité automatisés en fin de traitement

---

## ---Projet---

Projet réalisé dans le cadre de la formation **Data Engineer - DataSoluTech**.
