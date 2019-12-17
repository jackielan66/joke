import { Request, Response } from "express";
import { Content } from '../models/Content';
/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    var skipVal = 0; // 跳过几页
    var limitVal = 10; // 每页显示几个
    Content.find().sort({ _id: -1 }).skip(skipVal).limit(limitVal).then(contents => {
        res.render("uc/index", {
            title: "首页",
            contents: contents,
            hotContents: contents,
            // categorys: req.categorys
        })
    })
};


export const detail = (req: Request, res: Response) => {
    let _contentId = req.params.id;
    console.log(_contentId,'_contentId');
    let limitVal = 10;
    let _prevId = "";
    let _nextId = "";
    Content.findOne({ _id: _contentId }).then(content => {
        if(content){
            Content.update({ _id: _contentId }, { '$inc': { views: 1 } }).then(newcontent => {
                Content.find({}).sort({ views: -1 }).limit(limitVal).then(hotContents => {
                    res.render("uc/article.html", {
                        hotContents,
                        content: content,
                        title: content.title,
                    });
                })
            });
        }else{
            res.status(404).render('404.html', {
                title: 'No Found'
            })
        }
    }, notFound => {
        res.status(404).render('404.html', {
            title: 'No Found'
        })
    })
};

