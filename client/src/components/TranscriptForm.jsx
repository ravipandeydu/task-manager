import { useState } from "react";

const TranscriptForm = ({ onSubmit }) => {
  const [transcript, setTranscript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [parseStats, setParseStats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!transcript.trim()) {
      setError("Please enter a meeting transcript");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setParseStats(null);

    try {
      const result = await onSubmit({ transcript });

      if (result.success) {
        setSuccess(true);
        setTranscript("");
        setParseStats(result.stats);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error || "Failed to parse transcript");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Transcript submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6 border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
        Convert Meeting Minutes to Tasks
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label
            htmlFor="transcript"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Meeting Transcript
          </label>
          <textarea
            id="transcript"
            name="transcript"
            rows="6"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 glass border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-gray-800 text-sm"
            placeholder="Paste your meeting transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Our AI will extract tasks, assignees, due dates, and priorities from your meeting transcript.
          </p>
        </div>

        {error && (
          <div className="p-2 sm:p-3 glass border-red-300 text-red-700 rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-2 sm:p-3 glass border-green-300 text-green-700 rounded-lg text-xs sm:text-sm">
            Successfully extracted tasks from transcript!
          </div>
        )}

        {parseStats && (
          <div className="p-2 sm:p-3 glass border-blue-300 text-blue-700 rounded-lg text-xs sm:text-sm">
            <p className="font-medium mb-1">Parsing Statistics:</p>
            <ul className="list-disc pl-5">
              <li>Tasks extracted: {parseStats.tasksExtracted}</li>
              <li>With assignees: {parseStats.withAssignees}</li>
              <li>With due dates: {parseStats.withDueDates}</li>
              <li>With priorities: {parseStats.withPriorities}</li>
            </ul>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2 sm:py-3 px-4 rounded-lg text-white font-medium backdrop-blur-sm text-sm sm:text-base ${isSubmitting ? "bg-blue-400/70" : "bg-blue-500/70 hover:bg-blue-600/70 transition-all duration-200 shadow-lg"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Extract Tasks"}
        </button>
      </form>
    </div>
  );
};

export default TranscriptForm;