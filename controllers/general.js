import Feedback from "../models/Feedback.js";

export const feedback = async (req, res) => {
    // return res.status(400).json({message:'something went wrong'})
    try {
        let { designAndLayout, mobileResponsiveness, overallSatisfaction, suggestion, email } = req.body;
        suggestion = suggestion.trim(); 

        // console.log(req.body)
        // Check if at least one feedback aspect is provided
        if (!designAndLayout && !mobileResponsiveness && !overallSatisfaction && !suggestion) {
            return res.status(400).json({ message: 'Invalid input. At least one feedback aspect is required.' });
        }

        // Create a new feedback document and save it to the database using await
        const savedFeedback = await Feedback.create({
            email,
            designAndLayout,
            mobileResponsiveness,
            overallSatisfaction,
            suggestion,
        });

        // Respond with success message and saved feedback details
        return res.status(200).json({
            message: 'Feedback submitted successfully',
        });
    } catch (e) {
        return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
};
