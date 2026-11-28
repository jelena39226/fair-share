"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { useEffect, useState, type FormEvent } from "react";

const columns = [
  { id: "backlog", title: "Za planiranje", color: "bg-[#E5E3DC]" },
  { id: "todo", title: "Za uraditi", color: "bg-[#9CCBFF]" },
  { id: "inProgress", title: "U toku", color: "bg-[#FF6B35]" },
  { id: "done", title: "Završeno", color: "bg-[#93E2C3]" }
] as const;

type TaskStatus = (typeof columns)[number]["id"];

type Task = {
  id: string;
  number: number;
  title: string;
  status: TaskStatus;
};

const storageKey = "fairshare-dashboard-tasks";

const initialTasks: Task[] = [
  { id: "task-12", number: 12, title: "Napraviti skice ekrana", status: "backlog" },
  { id: "task-13", number: 13, title: "Istražiti potrebe korisnika", status: "backlog" },
  { id: "task-14", number: 14, title: "Pripremiti prezentaciju", status: "backlog" },
  { id: "task-15", number: 15, title: "Osmisliti navigaciju", status: "todo" },
  { id: "task-16", number: 16, title: "Napraviti komponente", status: "todo" },
  { id: "task-17", number: 17, title: "Podesiti bazu podataka", status: "inProgress" },
  { id: "task-18", number: 18, title: "Povezati API", status: "inProgress" },
  { id: "task-19", number: 19, title: "Napisati opis projekta", status: "done" },
  { id: "task-20", number: 20, title: "Dogovoriti uloge u timu", status: "done" }
];

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.number === "number" &&
    Number.isInteger(task.number) &&
    typeof task.title === "string" &&
    task.title.trim().length > 0 &&
    columns.some((column) => column.id === task.status)
  );
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: task.id
  });

  return (
    <article
      ref={setNodeRef}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={`mb-2 rounded-xl border border-[#E5E3DC] bg-white p-4 ${
        isDragging ? "z-10 opacity-60 shadow-lg" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="h-1.5 w-10 rounded-full bg-[#B9AEFF]" />
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B6A73]">#{task.number}</span>
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Premesti zadatak: ${task.title}`}
            title="Prevuci da promeniš status"
            className="cursor-grab rounded px-1 text-lg leading-none text-[#6B6A73] hover:bg-[#F5F4F0] active:cursor-grabbing"
          >
            ⋮⋮
          </button>
        </div>
      </div>
      <h3 className="text-sm font-medium">{task.title}</h3>
      <div className="mt-5 flex items-center justify-between">
        <div
          aria-label="Dodeljeno članu AM"
          className="grid h-7 w-7 place-items-center rounded-full bg-[#B9AEFF] text-[10px] font-semibold text-[#16161D]"
        >
          AM
        </div>
        <span className="text-[11px] text-[#6B6A73]">Član tima</span>
      </div>
    </article>
  );
}

function TaskColumn({
  column,
  tasks
}: {
  column: (typeof columns)[number];
  tasks: Task[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-40 rounded-2xl bg-white p-3 transition-colors ${
        isOver ? "ring-2 ring-[#FF6B35]" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${column.color}`} />
          <h2 className="text-sm font-semibold">{column.title}</h2>
        </div>
        <span className="rounded-full bg-[#F5F4F0] px-2 py-0.5 text-xs text-[#6B6A73]">
          {tasks.length}
        </span>
      </div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      {tasks.length === 0 && (
        <p className="rounded-xl border border-dashed border-[#E5E3DC] px-3 py-5 text-center text-xs text-[#6B6A73]">
          Prevuci zadatak ovde
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [hasLoadedTasks, setHasLoadedTasks] = useState(false);
  const [canPersistTasks, setCanPersistTasks] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    try {
      const savedTasks = window.localStorage.getItem(storageKey);
      if (savedTasks) {
        const parsedTasks: unknown = JSON.parse(savedTasks);
        if (!Array.isArray(parsedTasks) || !parsedTasks.every(isTask)) {
          throw new Error("Sačuvani zadaci nisu ispravnog formata.");
        }
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error("Nije moguće učitati sačuvane zadatke.", error);
      setStorageError("Sačuvani zadaci ne mogu da se učitaju. Prikazani su početni zadaci.");
      setCanPersistTasks(false);
    } finally {
      setHasLoadedTasks(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedTasks || !canPersistTasks) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(tasks));
      setStorageError("");
    } catch (error) {
      console.error("Nije moguće sačuvati zadatke.", error);
      setStorageError("Izmene ne mogu da se sačuvaju u ovom pregledaču.");
      setCanPersistTasks(false);
    }
  }, [canPersistTasks, hasLoadedTasks, tasks]);

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    setTasks((currentTasks) => {
      const nextNumber = currentTasks.reduce(
        (largestNumber, task) => Math.max(largestNumber, task.number),
        11
      ) + 1;
      return [
        ...currentTasks,
        { id: crypto.randomUUID(), number: nextNumber, title, status: "backlog" }
      ];
    });
    setNewTaskTitle("");
    setIsAddFormOpen(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const targetStatus = columns.find((column) => column.id === event.over?.id)?.id;
    if (!targetStatus) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === event.active.id ? { ...task, status: targetStatus } : task
      )
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#F5F4F0] px-4 py-6 text-[#16161D] sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FF6B35] text-xl font-bold text-white"
            >
              f
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6B6A73]">
                FairSharely EDU
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">Campus Connect</h1>
            </div>
          </div>
          {isAddFormOpen ? (
            <form onSubmit={handleAddTask} className="flex w-full gap-2 sm:w-auto">
              <label className="sr-only" htmlFor="new-task-title">
                Naziv zadatka
              </label>
              <input
                autoFocus
                id="new-task-title"
                maxLength={120}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="Unesi naziv zadatka"
                required
                value={newTaskTitle}
                className="min-w-0 flex-1 rounded-xl border border-[#E5E3DC] bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B35] sm:w-64"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#E85B29]"
              >
                Dodaj
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddFormOpen(false);
                  setNewTaskTitle("");
                }}
                aria-label="Zatvori formu"
                className="rounded-xl px-3 py-2 text-sm text-[#6B6A73] hover:bg-[#F5F4F0]"
              >
                ×
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddFormOpen(true)}
              className="self-start rounded-full bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E85B29] sm:self-auto"
            >
              + Dodaj zadatak
            </button>
          )}
        </header>

        {storageError && (
          <p role="alert" className="mb-4 rounded-xl bg-[#FFE9DE] px-4 py-3 text-sm text-[#71331C]">
            {storageError}
          </p>
        )}

        <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Napredak", `${progress}%`],
            ["Svi zadaci", `${totalTasks}`],
            ["U toku", `${tasks.filter((task) => task.status === "inProgress").length}`],
            ["Završeno", `${completedTasks}`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#E5E3DC] bg-white p-4 sm:p-5">
              <p className="text-xs font-medium text-[#6B6A73]">{label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            </div>
          ))}
        </section>

        <DndContext
          id="fairshare-dashboard"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <section
            aria-label="Tabla zadataka"
            className="grid auto-cols-[16rem] grid-flow-col gap-3 overflow-x-auto pb-2 md:grid-flow-row md:grid-cols-4"
          >
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            ))}
          </section>
        </DndContext>
      </div>
    </main>
  );
}
