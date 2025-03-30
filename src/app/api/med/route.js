import pool from "@/lib/db";
import { NextResponse } from "next/server";

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

    // Vérifier si un médecin avec le même  nom existe déjà
    const checkQuery = "SELECT COUNT(*) AS count FROM medecins WHERE nom = ?";
    const [rows] = await pool.query(checkQuery, [nom]);

    if (rows[0].count > 0) {
      return NextResponse.json(
        { error: "Un médecin existe déjà avec  ce nom." },
        { status: 409 } // 409 = Conflict (Conflit de données)
      );
    }

    // Insérer le nouveau médecin
    const insertQuery =
      "INSERT INTO medecins ( nom, nbJours, tauxJournaliers) VALUES ( ?, ?, ?)";
    await pool.query(insertQuery, [nom, nbJours, tauxJournaliers]);

    return NextResponse.json(
      { message: "Médecin ajouté avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du médecin", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
