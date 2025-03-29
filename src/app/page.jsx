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
  const [editMode, setEditMode] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({
    id: "",
    numMed: "",
    nom: "",
    nbJours: 0,
    tauxJournalier: 0,
  });

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor((prev) => ({
      ...prev,
      [name]:
        name === "nbJours" || name === "tauxJournalier" ? Number(value) : value,
    }));
  };

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

    const prestations = doctors.map((doc) => doc.nbJours * doc.tauxJournalier);
    const moyenne =
      prestations.reduce((acc, val) => acc + val, 0) / prestations.length;
    const min = Math.min(...prestations);
    const max = Math.max(...prestations);
    const total = prestations.reduce((acc, val) => acc + val, 0);

    setStats({ moyenne, min, max, total });
  }, [doctors]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCurrentDoctor({
      id: "",
      numMed: "",
      nom: "",
      nbJours: 0,
      tauxJournalier: 0,
    });
    setEditMode(false);
    setFormOpen(false);
  };

  //ajouter un médecin
  const handleAddMed = async () => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("numMed", currentDoctor.numMed);
    formData.append("nom", currentDoctor.nom);
    formData.append("nbJours", currentDoctor.nbJours);
    formData.append("tauxJournalier", currentDoctor.tauxJournalier);

    try {
      const response = await fetch("api/med", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentDoctor),
      });
      if (response.ok) {
        const updatedDoctors = await response.json();
        setDoctors(updatedDoctors);
        // Réinitialiser le formulaire
        resetForm();
      } else {
        console.error("Erreur lors de l'ajout du médecin");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du médecin", error);
    }
  };

  // Supprimer un médecin
  const handleDelete = (id) => {
    setDoctors(doctors.filter((doc) => doc.id !== id));
  };

  // Éditer un médecin
  const handleEdit = (doctor) => {
    setCurrentDoctor(doctor);
    setEditMode(true);
    setFormOpen(true);
  };

  // Données pour le graphique en camembert
  const chartData = [
    { name: "Moyenne", value: stats.moyenne },
    { name: "Minimale", value: stats.min },
    { name: "Maximale", value: stats.max },
  ];

  // Utilisation de #0cc0df comme couleur principale
  const COLORS = ["#0cc0df", "#0cc0df80", "#0cc0df40"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        {/* Stats Cards */}
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

        {/* Main Content */}
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
                  <div className="mt-2 sm:mt-0">
                    <Dialog open={formOpen} onOpenChange={setFormOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditMode(false);
                            setCurrentDoctor({
                              id: "",
                              numMed: "",
                              nom: "",
                              nbJours: 0,
                              tauxJournalier: 0,
                            });
                          }}
                          className="bg-[#0cc0df] hover:bg-[#0aa8c4] text-white transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Ajouter un médecin
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-[#0cc0df]">
                            {editMode
                              ? "Modifier un médecin"
                              : "Ajouter un médecin"}
                          </DialogTitle>
                          <DialogDescription>
                            {editMode
                              ? "Modifiez les informations du médecin"
                              : "Remplissez les informations pour ajouter un nouveau médecin"}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddMed}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="numMed" className="text-right">
                                Numéro
                              </Label>
                              <Input
                                id="numMed"
                                name="numMed"
                                value={currentDoctor.numMed}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="nom" className="text-right">
                                Nom
                              </Label>
                              <Input
                                id="nom"
                                name="nom"
                                value={currentDoctor.nom}
                                onChange={handleChange}
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
                                value={currentDoctor.nbJours}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="tauxJournalier"
                                className="text-right"
                              >
                                Taux journalier
                              </Label>
                              <Input
                                id="tauxJournalier"
                                name="tauxJournalier"
                                type="number"
                                min="0"
                                value={currentDoctor.tauxJournalier}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={resetForm}
                            >
                              Annuler
                            </Button>
                            <Button
                              type="submit"
                              className="bg-[#0cc0df] hover:bg-[#0aa8c4] text-white transition-all duration-200"
                            >
                              {editMode ? "Modifier" : "Ajouter"}
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
                  <div className="overflow-x-auto">
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
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctors.length > 0 ? (
                          doctors.map((doctor) => (
                            <TableRow
                              key={doctor.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {doctor.numMed}
                              </TableCell>
                              <TableCell>{doctor.nom}</TableCell>
                              <TableCell className="text-center">
                                {doctor.nbJours}
                              </TableCell>
                              <TableCell className="text-center">
                                {doctor.tauxJournalier}Ariary
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className="bg-[#0cc0df10] text-[#0cc0df] border-[#0cc0df] font-semibold"
                                >
                                  {(
                                    doctor.nbJours * doctor.tauxJournalier
                                  ).toFixed(2)}{" "}
                                  Ariary
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEdit(doctor)}
                                    className="h-8 w-8 border-gray-200 hover:bg-[#0cc0df10] hover:border-[#0cc0df] hover:text-[#0cc0df] transition-all duration-200"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Modifier</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDelete(doctor.id)}
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
                          `${Number(value).toFixed(2)}Ariary`
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
    </div>
  );
}
