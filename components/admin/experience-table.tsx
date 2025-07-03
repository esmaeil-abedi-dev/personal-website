"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteExperience } from "@/lib/actions";
import type { Experience } from "@prisma/client";

interface ExperienceTableProps {
  experiences: Experience[];
}

export function ExperienceTable({ experiences }: ExperienceTableProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);

  const handleDelete = async () => {
    if (experienceToDelete) {
      await deleteExperience(experienceToDelete.id); // Use id instead of _id
      router.refresh();
      setIsDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const confirmDelete = (experience: Experience) => {
    setExperienceToDelete(experience)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((exp: Experience) => (
              <TableRow key={exp.id}>
                <TableCell className="font-medium">{exp.position}</TableCell>
                <TableCell>{exp.company}</TableCell>
                <TableCell>
                  {/* Assuming startDate and endDate are strings or Date objects that can be rendered */}
                  {exp.startDate instanceof Date ? exp.startDate.toLocaleDateString() : exp.startDate} - {exp.endDate instanceof Date ? exp.endDate.toLocaleDateString() : (exp.endDate || "Present")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {exp.technologies?.map((tech: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/experience/${exp.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => confirmDelete(exp)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the experience entry for &quot;{experienceToDelete?.position}&quot; at &quot;
              {experienceToDelete?.company}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
