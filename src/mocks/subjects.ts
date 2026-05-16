import type { Subject } from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        code: "CS 101",
        name: "Introduction to Computer Science",
        department: "Computer Science",
        description:
            "Foundational course covering programming concepts, algorithms, and problem-solving with a high-level language.",
        createdAt: "2025-08-15T09:00:00.000Z",
    },
    {
        id: 2,
        code: "MATH 201",
        name: "Calculus II",
        department: "Mathematics",
        description:
            "Continuation of single-variable calculus, including integration techniques, sequences, and series.",
        createdAt: "2025-08-20T09:00:00.000Z",
    },
    {
        id: 3,
        code: "PHYS 150",
        name: "General Physics I",
        department: "Physics",
        description:
            "Introductory mechanics and thermodynamics with emphasis on principles and laboratory applications.",
        createdAt: "2025-09-01T09:00:00.000Z",
    },
];
