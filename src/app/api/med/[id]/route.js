import pool from "@/lib/db";
import { NextResponse } from "next/server";

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
// PUT: Mettre à jour un médecin

export async function PUT(req) {
  try {
    const { numMed, nom, nbJours, tauxJournaliers } = await req.json();

    // Vérifier si le médecin existe avant de le modifier
    const checkQuery =
      "SELECT COUNT(*) AS count FROM medecins WHERE numMed = ?";
    const [rows] = await pool.query(checkQuery, [numMed]);

    if (rows[0].count === 0) {
      return NextResponse.json(
        { error: "Médecin non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour les données du médecin
    const updateQuery =
      "UPDATE medecins SET nom = ?, nbJours = ?, tauxJournaliers = ? WHERE numMed = ?";
    await pool.query(updateQuery, [nom, nbJours, tauxJournaliers, numMed]);

    return NextResponse.json({ message: "Médecin mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du médecin:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
