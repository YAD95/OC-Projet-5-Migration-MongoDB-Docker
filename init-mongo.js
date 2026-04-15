
db = db.getSiblingDB('MedicalDB');

// 1. création  rôle data Engineer (lecture + écriture)
db.createUser({
  user: 'data_engineer',
  pwd: 'password_engineer',
  roles: [{ role: 'readWrite', db: 'MedicalDB' }]
});

// 2. création  rôle lecteur  
db.createUser({
  user: 'data_reader',
  pwd: 'password_reader',
  roles: [{ role: 'read', db: 'MedicalDB' }]
});

print("✅ Utilisateurs Data Engineer et Reader créés avec succès !");