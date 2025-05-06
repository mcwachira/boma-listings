import React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Rating from "@/components/reviews/Rating";
import Comment from "@/components/reviews/Comment"


type reviewInfoProps ={
    reviewInfo: {
        name: string
        image: string;
        comment: string;
        rating: number;
    };
    children?:React.ReactNode;
}
function ReviewCard({reviewInfo, children}:reviewInfoProps) {


    return (
        <Card className="relative">
            <CardHeader>

                <div className="flex items-center">
                    <img src={reviewInfo.image} alt="profile" className="w-12 h-12 rounded-full object-cover"/>

                    <div className="ml-4">
                        <h3 className="text-sm font-bold capitalize mb-1">
                            {reviewInfo.name}
                        </h3>

                        <Rating rating={reviewInfo.rating}/>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Comment comment={reviewInfo.comment} />
            </CardContent>
            {/*    delete button later*/}
            <div className="absolute top-3 right-3">
                {children}
            </div>
        </Card>
    );
}

export default ReviewCard;