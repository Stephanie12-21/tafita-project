"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Plus,
  Pencil,
  Trash2,
  Calculator,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DoctorManagement() {
  // État pour stocker la liste des médecins
  const [doctors, setDoctors] = useState([]);

  // État pour le formulaire
  const [formOpen, setFormOpen] = useState(false);
  const [numMed, setNumMed] = useState("");
  const [nom, setNom] = useState("");
  const [nbJours, setNbJours] = useState(0);
  const [tauxJournaliers, setTauxJournaliers] = useState(0);
  const [numMedEdit, setNumMedEdit] = useState("");
  const [nomEdit, setNomEdit] = useState("");
  const [nbJoursEdit, setNbJoursEdit] = useState(0);
  const [tauxJournaliersEdit, setTauxJournaliersEdit] = useState(0);
  const [formEditOpen, setFormEditOpen] = useState(false);
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  // Statistiques pour le graphique
  const [stats, setStats] = useState({
    moyenne: 0,
    min: 0,
    max: 0,
    total: 0,
  });

  // Calculer les statistiques
  useEffect(() => {
    if (doctors.length === 0) {
      setStats({ moyenne: 0, min: 0, max: 0, total: 0 });
      return;
    }

    const prestations = doctors.map((doc) => doc.nbJours * doc.tauxJournaliers);
    const moyenne =
      prestations.reduce((acc, val) => acc + val, 0) / prestations.length;
    const min = Math.min(...prestations);
    const max = Math.max(...prestations);
    const total = prestations.reduce((acc, val) => acc + val, 0);

    setStats({ moyenne, min, max, total });
  }, [doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/med");
      const data = await response.json();
      setDoctors(data);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des médecins:", error);
      setErrorModal({
        open: true,
        message: "Erreur lors de la récupération des médecins",
      });
    }
  };

  // Récupérer la liste des médecins
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNumMed("");
    setNom("");
    setNbJours(0);
    setTauxJournaliers(0);
    setFormOpen(false);
  };

  // Réinitialiser le formulaire d'édition
  const resetEditForm = () => {
    setNumMedEdit("");
    setNomEdit("");
    setNbJoursEdit(0);
    setTauxJournaliersEdit(0);
    setFormEditOpen(false);
  };

  // Ajouter un médecin
  const handleAddDoctor = async (event) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    const formData = new FormData(event.target);

    // Afficher les données du formulaire dans la console
    console.log("Form Data:", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/med", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convertir FormData en JSON
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.ok) {
        setSuccessModal({
          open: true,
          message: "Médecin ajouté avec succès",
        });

        // Fermer automatiquement après 3 secondes
        setTimeout(() => {
          setSuccessModal({
            open: false,
            message: "",
          });
        }, 3000);

        // Réinitialisation du formulaire
        resetForm();

        // Mise à jour immédiate du tableau avec le nouveau médecin
        fetchDoctors();
      } else if (response.status === 409) {
        console.error("Le numéro de médecin existe déjà");
        setErrorModal({
          open: true,
          message: "Le numéro de médecin existe déjà",
        });
      } else {
        setErrorModal({
          open: true,
          message: "Erreur lors de l'ajout du médecin",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du médecin", error);
      setErrorModal({
        open: true,
        message: "Erreur lors de l'ajout du médecin",
      });
    }
  };

  // Modifier un médecin
  const handleEditDoctor = (doctor) => {
    setFormEditOpen(true);
    setNumMedEdit(doctor.numMed);
    setNomEdit(doctor.nom);
    setNbJoursEdit(doctor.nbJours);
    setTauxJournaliersEdit(doctor.tauxJournaliers);
  };

  // Mettre à jour un médecin
  const handleUpdateDoctor = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const updatedData = Object.fromEntries(formData);

    const finalData = {
      ...updatedData,
      numMed: numMedEdit,
    };

    try {
      const response = await fetch(`/api/med/${numMedEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        setSuccessModal({
          open: true,
          message: "Médecin mis à jour avec succès",
        });

        // Fermer automatiquement après 3 secondes
        setTimeout(() => {
          setSuccessModal({
            open: false,
            message: "",
          });
        }, 3000);

        resetEditForm();
        fetchDoctors();
      } else {
        setErrorModal({
          open: true,
          message: "Erreur lors de la mise à jour du médecin",
        });

        console.error(
          "Erreur lors de la mise à jour du médecin :",
          await response.json()
        );
      }
    } catch (error) {
      setErrorModal({
        open: true,
        message: "Erreur lors de la mise à jour du médecin",
      });
      console.error("Erreur lors de la mise à jour du médecin :", error);
    }
  };

  // Supprimer un médecin
  const handleDelete = async (numMed) => {
    try {
      // Confirmation avant suppression
      if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?")) {
        return;
      }

      const response = await fetch(`/api/med/${numMed}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessModal({
          open: true,
          message: "Médecin supprimé avec succès",
        });

        // Fermer automatiquement après 3 secondes
        setTimeout(() => {
          setSuccessModal({
            open: false,
            message: "",
          });
        }, 3000);

        // Mise à jour immédiate du tableau
        fetchDoctors();
      } else {
        setErrorModal({
          open: true,
          message: "Erreur lors de la suppression du médecin",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du médecin:", error);
      setErrorModal({
        open: true,
        message: "Erreur lors de la suppression du médecin",
      });
    }
  };

  // Données pour le graphique en camembert
  const chartData = [
    { name: "Moyenne", value: stats.moyenne },
    { name: "Minimale", value: stats.min },
    { name: "Maximale", value: stats.max },
  ];

  const COLORS = ["#0cc0df", "#7ad7e8", "#0a8ea6"];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des Médecins
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0cc0df]"></div>
            <CardHeader className="pb-0">
              <CardDescription className="flex items-center justify-center text-base font-medium text-gray-500">
                <TrendingDown className="mr-2 h-4 w-4 text-[#0cc0df]" />
                Prestation Minimale
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <p className="text-4xl font-bold text-[#0cc0df] text-center">
                {stats.min.toFixed(2)}
              </p>
              <div className="text-lg text-gray-500 mt-2 text-center">
                Ariary
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0cc0df]"></div>
            <CardHeader className="pb-0">
              <CardDescription className="flex items-center justify-center text-base font-medium text-gray-500">
                <Calculator className="mr-2 h-4 w-4 text-[#0cc0df]" />
                Prestation Moyenne
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <p className="text-4xl font-bold text-[#0cc0df] text-center">
                {stats.moyenne.toFixed(2)}
              </p>
              <div className="text-lg text-gray-500 mt-2 text-center">
                Ariary
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0cc0df]"></div>
            <CardHeader className="pb-0">
              <CardDescription className="flex items-center justify-center text-base font-medium text-gray-500">
                <TrendingUp className="mr-2 h-4 w-4 text-[#0cc0df]" />
                Prestation Max
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <p className="text-4xl font-bold text-[#0cc0df] text-center">
                {stats.max.toFixed(2)}
              </p>
              <div className="text-lg text-gray-500 mt-2 text-center">
                Ariary
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0cc0df]"></div>
            <CardHeader className="pb-0">
              <CardDescription className="flex items-center justify-center text-base font-medium text-gray-500">
                <Calculator className="mr-2 h-4 w-4 text-[#0cc0df]" />
                Total Prestations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <p className="text-4xl font-bold text-[#0cc0df] text-center">
                {stats.total.toFixed(2)}
              </p>
              <div className="text-lg text-gray-500 mt-2 text-center">
                Ariary
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="liste" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="liste"
              className="data-[state=active]:bg-[#0cc0df] data-[state=active]:text-white"
            >
              Liste des Médecins
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-[#0cc0df] data-[state=active]:text-white"
            >
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liste" className="mt-0">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-white border-b pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Liste des Médecins
                  </CardTitle>

                  <div className="mt-3 ">
                    <Dialog open={formOpen} onOpenChange={setFormOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#0cc0df] hover:bg-[#0aa8c4] text-white transition-all duration-200">
                          <Plus className="h-4 w-4" />
                          <span>Ajouter un médecin</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-[#0cc0df]">
                            Ajouter un médecin
                          </DialogTitle>
                          <DialogDescription>
                            Remplissez les informations pour ajouter un nouveau
                            médecin
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddDoctor}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Nom
                              </Label>
                              <Input
                                id="nom"
                                name="nom"
                                type="text"
                                placeholder="Nom du médecin"
                                value={nom}
                                onChange={(e) => {
                                  setNom(e.target.value);
                                }}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="nbJours" className="text-right">
                                Nb de jours
                              </Label>
                              <Input
                                id="nbJours"
                                name="nbJours"
                                type="number"
                                min="0"
                                value={nbJours}
                                onChange={(e) => {
                                  setNbJours(e.target.value);
                                }}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="tauxJournaliers"
                                className="text-right"
                              >
                                Taux journalier
                              </Label>
                              <Input
                                id="tauxJournaliers"
                                name="tauxJournaliers"
                                type="number"
                                min="0"
                                value={tauxJournaliers}
                                onChange={(e) => {
                                  setTauxJournaliers(e.target.value);
                                }}
                                className="col-span-3"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              className="bg-[#0cc0df] hover:bg-[#0aa8c4] cursor-pointer w-full text-white transition-all duration-200"
                            >
                              Ajouter
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                resetForm();
                                setFormOpen(false);
                              }}
                              className="w-full cursor-pointer"
                            >
                              Annuler
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-22rem)] w-full">
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 sticky top-0">
                        <TableRow>
                          <TableHead className="w-[100px]">Numéro</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead className="text-center">
                            Nb de jours
                          </TableHead>
                          <TableHead className="text-center">
                            Taux journalier
                          </TableHead>
                          <TableHead className="text-center">
                            Prestation
                          </TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctors.length > 0 ? (
                          doctors.map((doctor) => (
                            <TableRow
                              key={doctor.numMed}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                MED-{doctor.numMed}
                              </TableCell>
                              <TableCell>{doctor.nom}</TableCell>
                              <TableCell className="text-center">
                                {doctor.nbJours}
                              </TableCell>
                              <TableCell className="text-center">
                                {doctor.tauxJournaliers} Ariary
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className="bg-[#0cc0df10] text-[#0cc0df] border-[#0cc0df] font-semibold"
                                >
                                  {(
                                    doctor.nbJours * doctor.tauxJournaliers
                                  ).toFixed(2)}{" "}
                                  Ariary
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditDoctor(doctor)}
                                    className="h-8 w-8 border-gray-200 hover:bg-[#0cc0df10] hover:border-[#0cc0df] hover:text-[#0cc0df] transition-all duration-200"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Modifier</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDelete(doctor.numMed)}
                                    className="h-8 w-8 border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Supprimer</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Aucun médecin trouvé.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-xl font-bold">
                  Statistiques des Prestations
                </CardTitle>
                <CardDescription>
                  Visualisation des prestations (Nb jours × Taux journalier)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                        animationBegin={0}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          `${Number(value).toFixed(2)} Ariary`
                        }
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          backgroundColor: "white",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de succès */}
      <Dialog
        open={successModal.open}
        onOpenChange={(open) => setSuccessModal({ ...successModal, open })}
      >
        <DialogContent className="sm:max-w-md border-green-500">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <DialogTitle className="text-center text-green-700">
              Opération réussie
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              {successModal.message}
            </DialogDescription>
            <Button
              onClick={() => setSuccessModal({ open: false, message: "" })}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'erreur */}
      <Dialog
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal({ ...errorModal, open })}
      >
        <DialogContent className="sm:max-w-md border-red-500">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-center text-red-700">
              Erreur
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              {errorModal.message}
            </DialogDescription>
            <Button
              onClick={() => setErrorModal({ open: false, message: "" })}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      <Dialog open={formEditOpen} onOpenChange={setFormEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0cc0df]">
              Modifier le médecin numéro {numMedEdit}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour modifier le médecin
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDoctor}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Nom du médecin"
                  value={nomEdit}
                  onChange={(e) => {
                    setNomEdit(e.target.value);
                  }}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nbJours" className="text-right">
                  Nb de jours
                </Label>
                <Input
                  id="nbJours"
                  name="nbJours"
                  type="number"
                  min="0"
                  value={nbJoursEdit}
                  onChange={(e) => {
                    setNbJoursEdit(e.target.value);
                  }}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tauxJournaliers" className="text-right">
                  Taux journalier
                </Label>
                <Input
                  id="tauxJournaliers"
                  name="tauxJournaliers"
                  type="number"
                  min="0"
                  value={tauxJournaliersEdit}
                  onChange={(e) => {
                    setTauxJournaliersEdit(e.target.value);
                  }}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-[#0cc0df] hover:bg-[#0aa8c4] cursor-pointer w-full text-white transition-all duration-200"
              >
                Modifier
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetEditForm();
                  setFormEditOpen(false);
                }}
                className="w-full cursor-pointer"
              >
                Annuler
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <footer>
        <div className="flex justify-center items-center w-full bg-gray-200 h-16">
          <p className="text-center text-gray-600">
            © 2025 - Tous droits réservés by Stéphanie MAMINIAINA
          </p>
        </div>
      </footer>
    </div>
  );
}
