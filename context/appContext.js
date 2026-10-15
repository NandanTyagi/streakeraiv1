"use client";

import { createContext, useState, useEffect, useRef } from "react";
import generateEmptyBoard from "../utils/generateEmptyBoard";
import { useAppAuth } from "@/hooks/useAppAuth";
import getCurrentUserBoardFromDb from "@/utils/getCurrentUserBoardFromDb";
import generateEmptyBoardCells from "@/utils/generateEmptyBoardCells";
import getDaysInMonth from "@/utils/getDaysInMonth";
import createPanelInDb from "@/utils/v2/createPanelInDb";
import usePanelAutosave from "@/hooks/usePanelAutosave";
import { number } from "zod";
import useV3Engine from "@/utils/useV3Engine";
import { useToast } from "@/hooks/use-toast";

export const AppContext = createContext({
  deleteHistoryMonth: async (month) => {},
  panels: [], mainPanelId: null, draft: null, panelBusy: false, panelError: "",
  selectPanel: async (id) => {}, saveDraft: async () => {}, startDraft: async (value) => {}, makeMainPanel: async () => {}, discardDraft: async () => {},
  users: [],
  boardUser: {},
  boards: [],
  currentHistoryPanel: {
    goalToAchieve: "",
    habitsNames: [],
    habitsValues: [],
    days: number,
    cells: [],
  },
  board: {
    _id: "",
    goalToAchieve: "",
    habitsNames: [],
    habitsValues: [],
    columns: [],
    rows: [],
    cells: [],
    history: [],
  },
  cells: [],
  cell: {},
  columns: [],
  column: {},
  rows: [],
  row: {},
  boardHeader: {},
  isAppLoading: false,
  isCellLoading: false,
  openAIResponse: [],
  openAIResponseDescription: [],
  sanitizedHTML: "",
  openAIResponseHeadersNames: [],
  openAIResponseHeadersValues: [],
  goalToAchieve: "",
  isSaved: true,
  setGoalToAchieve: () => {},
  setisAppLoading: () => {},
  setOpenAIResponse: () => {},
  setOpenAIResponseDescription: () => {},
  setIsCellLoading: () => {},
  setBoard: () => {},
  setCurrentHistoryPanel: (items) => {},
  setBoardUser: () => {},
  setOpenAIResponseHeadersNames: () => {},
  setOpenAIResponseHeadersValues: () => {},
  setIsSaved: () => {},
});

export function AppContextProvider({ children }) {
  const { isAuthenticated, user, isLoading } = useAppAuth();
  const { toast } = useToast();
  const isV3 = useV3Engine();
  const [users, setUsers] = useState();
  const [boardUser, setBoardUser] = useState(user?.email || {});
  const [boards, setBoards] = useState([]);
  const [currentHistoryPanel, setCurrentHistoryPanel] = useState();
  const [board, setBoard] = useState();
  const [cells, setCells] = useState();
  const [columns, setColumns] = useState();
  const [column, setColumn] = useState();
  const [rows, setRows] = useState();
  const [row, setRow] = useState();
  const [boardHeader, setBoardHeader] = useState();
  const [isAppLoading, setisAppLoading] = useState();
  const [isCellLoading, setIsCellLoading] = useState();
  const [sanitizedHTML, setSanitizedHTML] = useState();
  const [openAIResponse, setOpenAIResponse] = useState();
  const [openAIResponseDescription, setOpenAIResponseDescription] = useState();
  const [openAIResponseHeadersNames, setOpenAIResponseHeadersNames] =
    useState();
  const [openAIResponseHeadersValues, setOpenAIResponseHeadersValues] =
    useState();
  const [goalToAchieve, setGoalToAchieve] = useState();
  const [isSaved, setIsSaved] = useState(true);

  const [panels, setPanels] = useState([]);
  const [mainPanelId, setMainPanelId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [panelBusy, setPanelBusy] = useState(false);
  const [panelError, setPanelError] = useState("");
  const draftRef = useRef(null);
  const tz = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const sync = usePanelAutosave({ board, isSaved, setIsSaved, email: user?.email, loading: isLoading || isAppLoading, mainPanelId });
  async function libraryRequest(method = "GET", body) {
    const response = await fetch(`/api/panel-library?tz=${encodeURIComponent(tz())}`, {
      method, cache: "no-store", ...(body ? { headers: {"Content-Type":"application/json"}, body: JSON.stringify({...body, tz:tz()}) } : {}),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Your panels could not be loaded.");
    return data;
  }
  async function refreshLibrary() {
    const data = await libraryRequest();
    setPanels(data.panels); setMainPanelId(data.mainPanelId);
    return data;
  }
  async function loadPanel(id) {
    const loaded = await getCurrentUserBoardFromDb(user.email, id);
    if (!loaded) throw new Error("This panel could not be loaded.");
    setBoard({...loaded,boardUser:user.email}); setIsSaved(true);
    try { localStorage.setItem(`streaker-panel:${user.email}`, id); } catch {}
    return loaded;
  }
  async function selectPanel(id) {
    setPanelError(""); setPanelBusy(true);
    try {
      if (!board?.isDraft) await sync.flushSync();
      else { draftRef.current = board; setDraft(board); }
      if (id === "draft") { setBoard(draftRef.current); setIsSaved(true); }
      else await loadPanel(id);
      setCurrentHistoryPanel(undefined);
    } catch (error) { setPanelError(error.message); }
    finally { setPanelBusy(false); }
  }
  async function deleteHistoryMonth(month) {
    if (!board?._id || board.isDraft || panelBusy) throw new Error("Please wait until your panel is ready.");
    const panelId = board._id;
    setPanelBusy(true);
    try {
      await sync.flushSync();
      const response = await fetch("/api/history-month", {
        method: "DELETE", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({panelId, month, tz:tz()}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The month could not be deleted.");
      const monthName = new Date(`${month}-01T12:00:00`).toLocaleString("en-US", {month:"long"});
      setBoard(previous => previous?._id === panelId ? {...previous,
        historyRevision: (previous.historyRevision || 0) + 1,
        history: (previous.history || []).filter(item => !(String(item.year) === month.slice(0,4) && item.month === monthName)),
      } : previous);
      setCurrentHistoryPanel(undefined);
      setIsSaved(true);
    } finally { setPanelBusy(false); }
  }
  async function startDraft(value) {
    if (!board?.isDraft) await sync.flushSync();
    const next = { _id:"", isDraft:true, draftId:crypto.randomUUID(), goalToAchieve:value.title, habitsNames:value.habits.map(h=>h.name), habitsValues:value.habits.map(h=>h.target), explanation:value.explanation || "", days:getDaysInMonth(new Date()), cells:[], history:[] };
    draftRef.current=next; setDraft(next); setBoard(next); setIsSaved(true);
  }
  async function saveDraft() {
    if (!board?.isDraft || panelBusy) return;
    setPanelBusy(true); setPanelError("");
    try {
      const result=await libraryRequest("POST",{ draftId:board.draftId,title:board.goalToAchieve,habits:board.habitsNames.map((name,i)=>({name,target:board.habitsValues[i]})) });
      const loaded=await getCurrentUserBoardFromDb(user.email,result.id);
      if (!loaded) throw new Error("Panel saved, but could not be opened. Please retry.");
      await refreshLibrary();
      setBoard({...loaded,boardUser:user.email,cells:board.cells}); setIsSaved(false);
      draftRef.current=null;setDraft(null);
      try { localStorage.setItem(`streaker-panel:${user.email}`,result.id); } catch {}
    } catch(error) {setPanelError(error.message);}
    finally {setPanelBusy(false);}
  }
  async function makeMainPanel() {
    if (board?.isDraft || panelBusy) return;
    setPanelBusy(true);setPanelError("");
    try {
      await sync.flushSync();
      const result=await libraryRequest("PATCH",{panelId:board._id});
      setMainPanelId(result.mainPanelId);
      setIsSaved(false); // Queue this panel's image with its new main status.
    } catch(error) {setPanelError(error.message);}
    finally {setPanelBusy(false);}
  }
  async function discardDraft() {
    const target=mainPanelId || panels[0]?.id;
    if (target) await selectPanel(target);
    else {setBoard(undefined);setIsSaved(true);}
    draftRef.current=null;setDraft(null);
  }
  useEffect(() => {
    if (board?._id && !board.isDraft) setPanels(previous => previous.map(panel => panel.id === board._id ? {...panel,title:board.goalToAchieve} : panel));
  }, [board?._id, board?.goalToAchieve, board?.isDraft]);
  useEffect(() => {
    if(isLoading)return;
    let cancelled=false;
    setisAppLoading(true);setPanelError("");setIsSaved(true);setPanels([]);setMainPanelId(null);setDraft(null);draftRef.current=null;
    (async()=>{
      try {
        if(!user?.email){const empty=await generateEmptyBoard();if(!cancelled)setBoard(empty);return;}
        const data=await libraryRequest();
        let selected;
        try{selected=localStorage.getItem(`streaker-panel:${user.email}`);}catch{}
        const id=data.panels.some(p=>p.id===selected)?selected:data.mainPanelId || data.panels[0]?.id;
        const loaded=id?await getCurrentUserBoardFromDb(user.email,id):undefined;
        if(!cancelled){setPanels(data.panels);setMainPanelId(data.mainPanelId);setBoard(loaded?{...loaded,boardUser:user.email}:undefined);setBoardUser(user.email);}
      }catch(error){if(!cancelled)setPanelError(error.message);}
      finally{if(!cancelled){setisAppLoading(false);setIsCellLoading(false);}}
    })();
    return()=>{cancelled=true;};
  },[isLoading,user?.email]);

  return (
    <AppContext.Provider
      value={{
        ...sync,
        deleteHistoryMonth, panels, mainPanelId, draft, panelBusy, panelError, selectPanel, startDraft, saveDraft, makeMainPanel, discardDraft,
        users,
        boardUser,
        boards,
        board,
        currentHistoryPanel,
        cells,
        columns,
        column,
        rows,
        row,
        boardHeader,
        isAppLoading,
        isCellLoading,
        sanitizedHTML,
        openAIResponse,
        openAIResponseDescription,
        openAIResponseHeadersNames,
        openAIResponseHeadersValues,
        goalToAchieve,
        isSaved,
        setUsers,
        setBoardUser,
        setBoards,
        setCurrentHistoryPanel,
        setBoard,
        setCells,
        setColumns,
        setColumn,
        setRows,
        setRow,
        setBoardHeader,
        setisAppLoading,
        setSanitizedHTML,
        setIsCellLoading,
        setOpenAIResponse,
        setOpenAIResponseDescription,
        setOpenAIResponseHeadersNames,
        setOpenAIResponseHeadersValues,
        setGoalToAchieve,
        setIsSaved
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
