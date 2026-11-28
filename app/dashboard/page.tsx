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
  assigneeId: string | null;
  points: number;
};

type Member = {
  id: string;
  name: string;
  color: string;
};

const taskStorageKey = "fairshare-dashboard-tasks";
const memberStorageKey = "fairshare-dashboard-members";
const memberColors = ["#B9AEFF", "#9CCBFF", "#93E2C3", "#FFE27A", "#FFA8CF", "#E6D3AE"];

const initialMembers: Member[] = [
  { id: "member-ana", name: "Ana Marković", color: memberColors[0] },
  { id: "member-marko", name: "Marko Ilić", color: memberColors[1] },
  { id: "member-jelena", name: "Jelena Petrović", color: memberColors[2] }
];

const initialTasks: Task[] = [
  { id: "task-12", number: 12, title: "Napraviti skice ekrana", status: "backlog", assigneeId: "member-ana", points: 3 },
  { id: "task-13", number: 13, title: "Istražiti potrebe korisnika", status: "backlog", assigneeId: "member-jelena", points: 2 },
  { id: "task-14", number: 14, title: "Pripremiti prezentaciju", status: "backlog", assigneeId: null, points: 2 },
  { id: "task-15", number: 15, title: "Osmisliti navigaciju", status: "todo", assigneeId: "member-marko", points: 3 },
  { id: "task-16", number: 16, title: "Napraviti komponente", status: "todo", assigneeId: "member-ana", points: 5 },
  { id: "task-17", number: 17, title: "Podesiti bazu podataka", status: "inProgress", assigneeId: "member-marko", points: 5 },
  { id: "task-18", number: 18, title: "Povezati API", status: "inProgress", assigneeId: "member-jelena", points: 3 },
  { id: "task-19", number: 19, title: "Napisati opis projekta", status: "done", assigneeId: "member-ana", points: 2 },
  { id: "task-20", number: 20, title: "Dogovoriti uloge u timu", status: "done", assigneeId: "member-marko", points: 1 }
];

function parseTask(value: unknown): Task | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const task = value as Record<string, unknown>;
  if (
    typeof task.id === "string" &&
    typeof task.number === "number" &&
    Number.isInteger(task.number) &&
    typeof task.title === "string" &&
    task.title.trim().length > 0 &&
    columns.some((column) => column.id === task.status)
  ) {
    return {
      id: task.id,
      number: task.number,
      title: task.title,
      status: task.status as TaskStatus,
      assigneeId: typeof task.assigneeId === "string" ? task.assigneeId : null,
      points:
        typeof task.points === "number" && Number.isInteger(task.points) && task.points > 0
          ? task.points
          : 1
    };
  }
  return null;
}

function isMember(value: unknown): value is Member {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const member = value as Record<string, unknown>;
  return (
    typeof member.id === "string" &&
    typeof member.name === "string" &&
    member.name.trim().length > 0 &&
    typeof member.color === "string" &&
    memberColors.includes(member.color)
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase())
    .join("");
}

function TaskCard({
  task,
  members,
  onAssigneeChange,
  onPointsChange
}: {
  task: Task;
  members: Member[];
  onAssigneeChange: (taskId: string, assigneeId: string | null) => void;
  onPointsChange: (taskId: string, points: number) => void;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: task.id
  });
  const assignee = members.find((member) => member.id === task.assigneeId);

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
      <div className="mt-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-[#16161D]"
          style={{ backgroundColor: assignee?.color ?? "#E5E3DC" }}
        >
          {assignee ? getInitials(assignee.name) : "—"}
        </span>
        <label className="sr-only" htmlFor={`assignee-${task.id}`}>Dodeli zadatak: {task.title}</label>
        <select
          id={`assignee-${task.id}`}
          value={task.assigneeId ?? ""}
          onChange={(event) => onAssigneeChange(task.id, event.target.value || null)}
          className="min-w-0 flex-1 rounded-lg border border-[#E5E3DC] bg-white px-2 py-1.5 text-xs text-[#16161D] outline-none focus:border-[#FF6B35]"
        >
          <option value="">Nedodeljeno</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor={`points-${task.id}`}>Poeni za zadatak: {task.title}</label>
        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#F5F4F0] px-2">
          <input
            id={`points-${task.id}`}
            type="number"
            min={1}
            max={20}
            value={task.points}
            onChange={(event) => {
              const points = Number(event.target.value);
              if (Number.isInteger(points) && points >= 1 && points <= 20) {
                onPointsChange(task.id, points);
              }
            }}
            className="w-7 bg-transparent py-1.5 text-right text-xs font-semibold outline-none"
          />
          <span className="text-[10px] text-[#6B6A73]">poena</span>
        </div>
      </div>
    </article>
  );
}

function TaskColumn({
  column,
  tasks,
  members,
  onAssigneeChange,
  onPointsChange
}: {
  column: (typeof columns)[number];
  tasks: Task[];
  members: Member[];
  onAssigneeChange: (taskId: string, assigneeId: string | null) => void;
  onPointsChange: (taskId: string, points: number) => void;
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
        <TaskCard
          key={task.id}
          task={task}
          members={members}
          onAssigneeChange={onAssigneeChange}
          onPointsChange={onPointsChange}
        />
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
  const [members, setMembers] = useState(initialMembers);
  const [hasLoadedTasks, setHasLoadedTasks] = useState(false);
  const [canPersistTasks, setCanPersistTasks] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    try {
      const savedTasks = window.localStorage.getItem(taskStorageKey);
      if (savedTasks) {
        const parsedTasks: unknown = JSON.parse(savedTasks);
        if (!Array.isArray(parsedTasks)) {
          throw new Error("Sačuvani zadaci nisu ispravnog formata.");
        }
        const migratedTasks = parsedTasks
          .map(parseTask)
          .filter((task): task is Task => task !== null);
        if (migratedTasks.length !== parsedTasks.length) {
          throw new Error("Sačuvani zadaci nisu ispravnog formata.");
        }
        setTasks(migratedTasks);
      }

      const savedMembers = window.localStorage.getItem(memberStorageKey);
      if (savedMembers) {
        const parsedMembers: unknown = JSON.parse(savedMembers);
        if (!Array.isArray(parsedMembers) || !parsedMembers.every(isMember)) {
          throw new Error("Sačuvani članovi nisu ispravnog formata.");
        }
        setMembers(parsedMembers);
      }
    } catch (error) {
      console.error("Nije moguće učitati sačuvane podatke projekta.", error);
      setStorageError("Sačuvani podaci projekta ne mogu da se učitaju. Prikazani su početni podaci.");
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
      window.localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
      window.localStorage.setItem(memberStorageKey, JSON.stringify(members));
      setStorageError("");
    } catch (error) {
      console.error("Nije moguće sačuvati podatke projekta.", error);
      setStorageError("Izmene projekta ne mogu da se sačuvaju u ovom pregledaču.");
      setCanPersistTasks(false);
    }
  }, [canPersistTasks, hasLoadedTasks, members, tasks]);

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
        {
          id: crypto.randomUUID(),
          number: nextNumber,
          title,
          status: "backlog",
          assigneeId: null,
          points: 1
        }
      ];
    });
    setNewTaskTitle("");
    setIsAddFormOpen(false);
  }

  function handleAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newMemberName.trim();
    if (!name) {
      return;
    }

    setMembers((currentMembers) => [
      ...currentMembers,
      {
        id: crypto.randomUUID(),
        name,
        color: memberColors[currentMembers.length % memberColors.length]
      }
    ]);
    setNewMemberName("");
    setIsAddMemberOpen(false);
  }

  function handleAssigneeChange(taskId: string, assigneeId: string | null) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => task.id === taskId ? { ...task, assigneeId } : task)
    );
  }

  function handlePointsChange(taskId: string, points: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => task.id === taskId ? { ...task, points } : task)
    );
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
  const activePointsFor = (memberId: string) =>
    tasks
      .filter((task) => task.assigneeId === memberId && task.status !== "done")
      .reduce((sum, task) => sum + task.points, 0);

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
                FairSharely EDU · PROJEKAT
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

        <section aria-labelledby="team-heading" className="mb-7 rounded-2xl border border-[#E5E3DC] bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="team-heading" className="text-base font-semibold">Tim projekta</h2>
              <p className="mt-1 text-xs text-[#6B6A73]">Aktivni poeni ne uključuju završene zadatke.</p>
            </div>
            {!isAddMemberOpen && (
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="rounded-full border border-[#E5E3DC] px-4 py-2 text-xs font-semibold transition-colors hover:bg-[#F5F4F0]"
              >
                + Dodaj člana
              </button>
            )}
          </div>
          {isAddMemberOpen && (
            <form onSubmit={handleAddMember} className="mb-4 flex flex-wrap gap-2">
              <label className="sr-only" htmlFor="new-member-name">Ime člana tima</label>
              <input
                autoFocus
                id="new-member-name"
                maxLength={80}
                onChange={(event) => setNewMemberName(event.target.value)}
                placeholder="Ime i prezime"
                required
                value={newMemberName}
                className="min-w-0 flex-1 rounded-xl border border-[#E5E3DC] bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B35] sm:max-w-xs"
              />
              <button type="submit" className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E85B29]">Dodaj člana</button>
              <button
                type="button"
                onClick={() => { setIsAddMemberOpen(false); setNewMemberName(""); }}
                aria-label="Zatvori formu"
                className="rounded-xl px-3 py-2 text-sm text-[#6B6A73] hover:bg-[#F5F4F0]"
              >
                ×
              </button>
            </form>
          )}
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const activePoints = activePointsFor(member.id);
              const assignedTasks = tasks.filter(
                (task) => task.assigneeId === member.id && task.status !== "done"
              ).length;
              return (
                <li key={member.id} className="flex items-center gap-3 rounded-xl bg-[#F5F4F0] p-3">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold"
                    style={{ backgroundColor: member.color }}
                  >
                    {getInitials(member.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{member.name}</p>
                    <p className="mt-0.5 text-xs text-[#6B6A73]">{assignedTasks} aktivnih zadataka</p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="block text-lg font-semibold leading-5">{activePoints}</span>
                    <span className="text-[10px] text-[#6B6A73]">poena</span>
                  </p>
                </li>
              );
            })}
            {members.length === 0 && (
              <li className="rounded-xl border border-dashed border-[#E5E3DC] px-3 py-5 text-center text-sm text-[#6B6A73] sm:col-span-2 lg:col-span-3">
                Tim još nema članova. Dodaj člana da bi mogao/la da mu dodeliš zadatke.
              </li>
            )}
          </ul>
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
                members={members}
                onAssigneeChange={handleAssigneeChange}
                onPointsChange={handlePointsChange}
              />
            ))}
          </section>
        </DndContext>
      </div>
    </main>
  );
}
