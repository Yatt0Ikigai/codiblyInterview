import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import axios from "axios";


export const t = initTRPC.create();

export const appRouter = t.router({
    getItems: t.procedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input }) => {
            const firstPart = await axios.get<IReqres>('https://reqres.in/api/resources').catch((err) => { throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })})
            const secPart = await axios.get<IReqres>('https://reqres.in/api/resources?page=2').catch((err) => { throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })})
            const items = [...firstPart.data.data, ...secPart.data.data];
            const result = items.filter((el) => el.id.toString().includes(input.id));
            return result
        }),
});


interface IReqres {
    page: number,
    per_page: number,
    total: number,
    total_pages: number,
    data: IResource[],
    support: {
        url: string,
        text: string,
    }
}
interface IResource {
    id: number,
    name: string,
    year: number,
    color: string,
    pantone_value: string
}

export type AppRouter = typeof appRouter;