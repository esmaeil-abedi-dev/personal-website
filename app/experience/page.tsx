import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import type { Experience, Education, SkillCategory } from "@prisma/client";

export const metadata = {
  title: "Experience - Esmaeil Abedi",
  description:
    "Learn about Esmaeil Abedi's professional experience and skills.",
};

export default async function ExperiencePage() {
  let experiences: Experience[] = [];
  let education: Education[] = [];
  let skills: SkillCategory[] = [];

  try {
    experiences = await prisma.experience.findMany({
      orderBy: {
        startDate: "desc",
      },
    });

    education = await prisma.education.findMany({
      orderBy: {
        startDate: "desc",
      },
    });

    skills = await prisma.skillCategory.findMany({
      orderBy: {
        order: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching experience data:", error);
    // Variables will remain empty arrays
  }

  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
          Experience
        </h1>

        {/* Work Experience */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
          <div className="space-y-8">
            <Suspense fallback={<div>Loading Experience...</div>}>
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{exp.position}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                      </div>
                      <p className="mb-4">{exp.description}</p>
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No work experience found.
                </p>
              )}
            </Suspense>
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Education</h2>
          <div className="space-y-8">
            <Suspense fallback={<div>Loading Educations results...</div>}>
              {education.length > 0 ? (
                education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{edu.degree}</h3>
                          <p className="text-muted-foreground">
                            {edu.institution}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                      {edu.description && <p>{edu.description}</p>}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No education found.</p>
              )}
            </Suspense>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Suspense fallback={<div>Loading Skills results...</div>}>
              {skills.length > 0 ? (
                skills.map((skillCategory) => (
                  <Card key={skillCategory.id}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">
                        {skillCategory.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                         {skillCategory.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground col-span-2">
                  No skills found.
                </p>
              )}
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
