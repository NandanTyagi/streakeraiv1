"use client";

import React, {useEffect, useContext} from "react";
import HistoryList from "../../components/historyList";
import { AppContext } from "../../context/appContext";



type Props = {};

const HistoryPage = (props: Props) => {
    const { board } = useContext(AppContext);

    useEffect(() => {
        console.log('board', board);
    }, [board]);
  

  return (
    <main className="container mx-auto py-10 px-4 bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-3xl font-extrabold text-center mb-8">My History</h1>
      {board && <HistoryList items={board.history} />}
    </main>
  );
};

export default HistoryPage;
