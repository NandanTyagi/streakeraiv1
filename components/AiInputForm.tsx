"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button/Button"
import { Input } from "@/components/ui/input/Input"
import Loading from "@/components/Loading"
import { useRouter } from "next/navigation"

import { AppContext } from "@/context/appContext";
import { useEffect, useState, useContext, use } from "react";
import { set } from "mongoose"
import createCompleation from "@/utils/openai/createCompleation"
import handelBoards from "@/utils/handelBoards";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/Form"


const formSchema = z.object({
  goal: z.string().min(10, {
    message: "Goal must be at least 10 characters.",
  }),
})

function AiInputForm() {
  const router = useRouter()
  const { board,
    setBoard,
    isAppLoading,
    setisAppLoading,
    setIsCellLoading,
    openAIResponse,
    openAIResponseDescription,
    setOpenAIResponse,
    setOpenAIResponseDescription,
    setOpenAIResponseHeadersNames,
    setOpenAIResponseHeadersValues,
    setGoalToAchieve,
    goalToAchieve } =
    useContext(AppContext);
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [input, setInput] = useState("");

  const handelHabits = async (habitKeys: any, habitValues: any) => {
    //@ts-ignore
    setBoard((prev: any) => ({
      ...prev,
      habitNames: habitKeys,
      habitValues: habitValues,
    }))
  };

  // const [openAIResponse, setOpenAIResponse] = useState<string>('');
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    router.push('/suggestions')
    //@ts-ignore
    setisAppLoading(true)
    //@ts-ignore
    setOpenAIResponse(prev => prev = '');
    const compleatiion = await createCompleation(values);
    //@ts-ignore
    setGoalToAchieve(values.goal);
    //@ts-ignore
    const splitCompleation = compleatiion.split(',');
    //@ts-ignore
    const splitCompleationHeadersAndValues = compleatiion.split('||')[0];
    console.log('splitCompleationHeadersAndValues', splitCompleationHeadersAndValues);
    //@ts-ignore
    const splitCompleationDescription = compleatiion.split('||')[1];
    console.log('splitCompleationDescription', splitCompleationDescription);
    let compleationvalues = splitCompleation.slice(0, 10);
    console.log('compleation values', compleationvalues);
    let compleationDescription = splitCompleation.slice(10, splitCompleation.length - 1);
    console.log('compleationDescription', compleationDescription);
    //@ts-ignore
    // setOpenAIResponse(prev => prev = Array.from(splitCompleation));
    setOpenAIResponse(prev => prev = compleationvalues);
    let descriptions= splitCompleationDescription.split('.');
    console.log('Description', descriptions);
    //@ts-ignore
    setOpenAIResponseDescription(prev => prev = descriptions);

    console.log('response.compleation************************************', compleatiion);
    console.log('response.Joindcompleation************************************', splitCompleation);
    console.log('response.openairesopnse************************************', openAIResponse);

    //@ts-ignore
    setOpenAIResponseHeadersNames(prev => {
      let names = splitCompleation.slice(0, 5);
      prev = names;
    });

    //@ts-ignore
    setOpenAIResponseHeadersValues(prev => {
      let values = splitCompleation.slice(5, 10);
      prev = values;
    });

    //@ts-ignore
    setTimeout(() => {
      if (!openAIResponse) return;
      const habits = openAIResponse
      //@ts-ignore
      // setOpenAIResponse(prev => {
      //   prev = ['Day', ...Object.keys(habits), ...Object.values(habits)];
      //   return prev;
      // });
      //@ts-ignore
      setBoard((prev: any) => ({
        ...prev,
        //@ts-ignore
        habitsNames: ['Day', ...Object.keys(habits)],
        //@ts-ignore
        habitsValues: ["", ...Object.values(habits)],
      }))

      handelBoards(board, user?.email);

      console.log('board in form', board)
    }, 500)
    console.log(values)
    //@ts-ignore
    setisAppLoading(false)
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border border-[#530DA2] rounded bg-slate-100 p-2 mt-1  w-[95%] sm:max-w-[500px] h-[300px] flex flex-col justify-center items-center">
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem className="w-full text-center">
              <FormLabel>What do you want to achieve?</FormLabel>
              <FormControl>
                <Input type="textarea" className="bg-white p-1 text-left" placeholder="I want to live a healthy life." {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Let&apos;s break down your goal and suggest 5 daily habits that will serve as a framework to help you achieve it.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-[#530DA2] text-white cursor-pointer w-[stretch]">Generate streak items</Button>
      </form>
    </Form>
  )
}

export default AiInputForm;

async function getCompletion(message: { goal: string; }, setOpenAIResponse: any, openAIResponse: any) {
  console.log('BE RES', message.goal)
  const response = await fetch('/api/v1/simplecompleation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  }).then(async (response: any) => {
    const data = await response.body
    setOpenAIResponse('');
    let text = '';
    const reader = response.body?.getReader();
    while (true) {
      const { done, value } = await reader?.read();
      if (done) {
        break
      };
      const currentChunk = new TextDecoder().decode(value);
      setOpenAIResponse((prev: any) => prev + currentChunk);
      console.log(message);
    }
    console.log('response.body************************************', data);
  }).catch((err: any) => {
    console.log(err);
  })
}
