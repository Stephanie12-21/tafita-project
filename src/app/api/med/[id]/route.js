import pool from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE: Supprimer un médecin
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Numéro de médecin manquant" },
        { status: 400 }
      );
    }

    const query = "DELETE FROM medecins WHERE numMed = ?";
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Médecin introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Médecin supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT: Mettre à jour un médecin
export async function PUT(req) {
  try {
    const { numMed, nom, nbJours, tauxJournaliers } = await req.json();

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
