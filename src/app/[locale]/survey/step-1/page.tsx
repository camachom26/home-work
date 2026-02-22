"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSurvey } from "@/app/components/survey/SurveyProvider";
import { SurveyShell, PrimaryButton, SecondaryButton } from "@/app/components/survey/SurveyShell";

const EXAMPLE_PITCH = `I've spent the last 5+ years managing a household, developing critical skills that directly apply to professional roles. I've juggled complex schedules, managed budgets, coordinated with multiple stakeholders (schools, healthcare providers, vendors), and maintained detailed systems for family organization.

I'm excellent at problem-solving, communicating clearly with different groups, paying attention to details, and adapting quickly to new challenges. I'm ready to channel these transferable skills into a professional environment where I can contribute meaningfully. I'm motivated, reliable, and eager to grow—and I bring a fresh perspective from managing real-world complexity.`;

export default function SurveyStep1() {
  const router = useRouter();
  const { answers, setAnswers } = useSurvey();
  const [isRecording, setIsRecording] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [examplePitch, setExamplePitch] = useState(EXAMPLE_PITCH);
  const [showExample, setShowExample] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    setBrowserSupportsSpeech(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => {
        setIsRecording(false);
        setInterimTranscript("");
      };
      
      recognition.onresult = (event: any) => {
        let transcript = "";
        let interim = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            transcript += transcriptSegment + " ";
          } else {
            interim += transcriptSegment;
          }
        }
        
        // Show interim results in real-time
        setInterimTranscript(interim);
        
        // Update final results
        if (transcript) {
          setAnswers(prev => ({
            ...prev,
            notes: prev.notes + transcript
          }));
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };
      
      recognitionRef.current = recognition;
    }
  }, [setAnswers]);

  const handleStartRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleClearPitch = () => {
    setAnswers(prev => ({ ...prev, notes: "" }));
  };

  return (
    <SurveyShell
      title="Your Return-to-Work Pitch"
      subtitle="Describe any experience transitioning back to the workforce from homemaking."
      step={1}
      total={4}
    >
      <div className="space-y-6">
        {/* Speech-to-Text Input Section */}
        
        {/* Tips Section */}
        <div className="rounded-2xl border border-black/10 bg-blue-50/50 p-6">
          <h3 className="font-['Space_Mono',sans-serif] font-bold text-[16px] text-[#1e1e1e] mb-3">
            Tips for a Strong Pitch
          </h3>
          <ul className="space-y-2">
            <li className="font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b]">
              • <strong>Highlight transferable skills:</strong> Budget management, scheduling, organization, communication
            </li>
            <li className="font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b]">
              • <strong>Be confident:</strong> Frame your gap as an asset, not a liability
            </li>
            <li className="font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b]">
              • <strong>Show readiness:</strong> Mention any recent training, skills updates, or learning you've done
            </li>
            <li className="font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b]">
              • <strong>Keep it authentic:</strong> Use your own voice and experience
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
        
          <div className="flex items-center justify-between mb-4">

            
            <h3 className="font-['Space_Mono',sans-serif] font-bold text-[16px] text-[#1e1e1e]">
              Your Pitch
            </h3>
            {browserSupportsSpeech && (
              <button
                type="button"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`px-4 py-2 rounded-lg font-['Space_Mono',sans-serif] text-[13px] font-bold transition ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isRecording ? "🎙️ Stop Recording" : "🎙️ Record Voice"}
              </button>
            )}
          </div>

          <p className="font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b] mb-4">
            {browserSupportsSpeech
              ? "Click the microphone button to record your pitch, or type directly below."
              : "Type your pitch below. (Your browser doesn't support voice recording)"}
          </p>

          <textarea
            value={answers.notes + interimTranscript}
            onChange={(e) => setAnswers(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Describe your experience returning to work from homemaking or any potential interests. What skills did you develop? What are you excited about?"
            className="w-full h-32 p-4 rounded-lg border border-black/10 font-['Space_Mono',sans-serif] text-[14px] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {answers.notes && (
            <button
              type="button"
              onClick={handleClearPitch}
              className="mt-3 text-[13px] font-['Space_Mono',sans-serif] text-red-500 hover:text-red-600 transition"
            >
              Clear text
            </button>
          )}
        </div>

        {/* Example Pitch Section */}
        <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Space_Mono',sans-serif] font-bold text-[16px] text-black">
              Example Pitch
            </h3>
            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className="text-[13px] font-['Space_Mono',sans-serif] text-[#4b4b4b] hover:text-[#1e1e1e] transition"
            >
              {showExample ? "Hide" : "Show"}
            </button>
          </div>

          {showExample && (
            <>
              <p className="font-['Space_Mono',sans-serif] text-[13px] text-[#4b4b4b] mb-4">
                Here's an example of a strong pitch. Edit it to fit your story or use it as inspiration:
              </p>
              <textarea
                value={examplePitch}
                onChange={(e) => setExamplePitch(e.target.value)}
                className="w-full h-40 p-4 rounded-lg border border-black/10 bg-blue-50 font-['Space_Mono',sans-serif] text-[13px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="button"
                onClick={() => setAnswers(prev => ({ ...prev, notes: examplePitch }))}
                className="mt-3 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-black font-['Space_Mono',sans-serif] text-[13px] font-bold transition"
              >
                Use this pitch as starting point
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <SecondaryButton onClick={() => router.back()}>Back</SecondaryButton>
        <PrimaryButton onClick={() => router.push("step-2")}>Next</PrimaryButton>
      </div>
    </SurveyShell>
  );
}
