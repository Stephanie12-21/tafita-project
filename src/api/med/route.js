import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

// Créer une connexion à la base de données MySQL
const pool = mysql.createPool({
  host: "mysql-10aede29-lileekarimakerkoub-27c1.j.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_vQNfesms0nYuwLGbPJ1",
  database: "defaultdb",
  port: 21901,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// GET: Récupérer tous les médecins
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM medecins");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Ajouter un médecin
export async function POST(req) {
  try {
    const { numMed, nom, nbJours, tauxJournaliers } = await req.json();
    const query =
      "INSERT INTO medecins (numMed, nom, nbJours, tauxJournaliers) VALUES (?, ?, ?, ?)";
    await pool.query(query, [numMed, nom, nbJours, tauxJournaliers]);
    return NextResponse.json(
      { message: "Médecin ajouté avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Mettre à jour un médecin
export async function PUT(req) {
  try {
    const { numMed, nom, nbJours, tauxJournaliers } = await req.json();
    const query =
      "UPDATE medecins SET nom = ?, nbJours = ?, tauxJournaliers = ? WHERE numMed = ?";
    await pool.query(query, [nom, nbJours, tauxJournaliers, numMed]);
    return NextResponse.json({ message: "Médecin mis à jour avec succès" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Supprimer un médecin
export async function DELETE(req) {
  try {
    const { numMed } = await req.json();
    const query = "DELETE FROM medecins WHERE numMed = ?";
    await pool.query(query, [numMed]);
    return NextResponse.json({ message: "Médecin supprimé avec succès" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
