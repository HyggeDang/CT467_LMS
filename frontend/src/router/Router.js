import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInSignUp from "../components/signin-signup/SignInSignUp";
import DashboardReader from "../components/dashboard-reader/DashboardReader";
import BooksReader from "../components/dashboard-reader/BooksReader";
import TicketsReader from "../components/dashboard-reader/TicketsReader";
import FinesReader from "../components/dashboard-reader/FinesReader";
import DashboardLibrarian from "../components/dashboard-librarian/DashboardLibrarian";
import BooksLibrarian from "../components/dashboard-librarian/BooksLibrarian";
import AuthorsLibrarian from "../components/dashboard-librarian/AuthorsLibrarian";
import GenresLibrarian from "../components/dashboard-librarian/GenresLibrarian";
import PublisherLibrarian from "../components/dashboard-librarian/PublisherLibrarian";
import TicketsLibrarian from "../components/dashboard-librarian/TicketsLibrarian";
import FinesLibrarian from "../components/dashboard-librarian/FinesLibrarian";
import ReadersLibrarian from "../components/dashboard-librarian/ReadersLibrarian";

/**
 * MyRouter component
 * @param {v} props
 * @return {jsx}
 */
const Router = (props) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignInSignUp />} />
                <Route path="/login" element={<SignInSignUp />} />
                <Route path="/dashboard-reader" element={<DashboardReader />} />
                <Route path="/books-reader" element={<BooksReader />} />
                <Route path="/tickets-reader" element={<TicketsReader />} />
                <Route path="/fines-reader" element={<FinesReader />} />
                <Route path="/dashboard-librarian" element={<DashboardLibrarian />} />
                <Route path="/books-librarian" element={<BooksLibrarian />} />
                <Route path="/authors-librarian" element={<AuthorsLibrarian />} />
                <Route path="/genres-librarian" element={<GenresLibrarian />} />
                <Route path="/publishers-librarian" element={<PublisherLibrarian />} />
                <Route path="/tickets-librarian" element={<TicketsLibrarian />} />
                <Route path="/fines-librarian" element={<FinesLibrarian />} />
                <Route path="/readers-librarian" element={<ReadersLibrarian />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;