import { http as msw, HttpResponse } from "msw";

import { worksPayload, coursesPayload, profilePayload, topPayload } from "./data";
export const handlers = [
  // ─── Работы ───
  msw.get("/api/works", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    return HttpResponse.json({ ...worksPayload, page });
  }),

  msw.get("/api/works/:id", ({ params }) => {
    const { id } = params;
    const work = worksPayload.items.find((w) => w.id === id);
    if (!work) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(work);
  }),

  // ─── Курсы ───
  msw.get("/api/courses", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    return HttpResponse.json({ ...coursesPayload, page });
  }),

  msw.get("/api/courses/:id", ({ params }) => {
    const { id } = params;
    const course = coursesPayload.items.find((c) => c.id === id);
    if (!course) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(course);
  }),


  msw.get("/api/profile/:id", () => {
      return HttpResponse.json(profilePayload);
  }),

  msw.get("/api/top", () => {
    return HttpResponse.json(topPayload);
  }),

];