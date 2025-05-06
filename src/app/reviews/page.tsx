import {deleteReviewAction, fetchPropertyReviewsByUser} from "@/actions/action";
import ReviewCard from "@/components/reviews/ReviewCard"
import EmptyList from "@/components/home/EmptyList"
import {IconButton} from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";

async function ReviewsPage() {

    const reviews = await fetchPropertyReviewsByUser()
    console.log(reviews)
    if(reviews.length === 0)  return <EmptyList/>
return (
    <>
    <section className="grid md:grid-cols-2 gap-8 mt-4">
        {reviews.map((review) => {
            const {comment, rating} = review;
            const {name, image} = review.property;
            const reviewInfo = {
                comment,
                rating,
                name,
                image,
            };

            return (
                <ReviewCard key={review.id} reviewInfo={reviewInfo}>
                    <DeleteReview reviewId={review.id}/>
                </ReviewCard>
            )
        })}
    </section>
    </>
)
}


const DeleteReview =({reviewId} : {reviewId: string}) => {
    const deleteReview = deleteReviewAction.bind(null, {reviewId})
    return (
        <FormContainer action={deleteReview}>
            <IconButton actionType="delete"/>
        </FormContainer>
    )
}
export default ReviewsPage;