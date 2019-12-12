import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    res.render("uc/index", {
        title: "首页"
    });
};