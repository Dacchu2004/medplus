"use client"

import { useState, useEffect } from "react"
import { fetchPatientList } from "@/lib/api-service"
import { getCurrentUser } from "@/lib/auth-service"

export default function Consultation() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [structuredData, setStructuredData] = useState<any>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    const loadPatients = async () => {
      try {
        const data = await fetchPatientList();
        setPatients(data as any[]);
        if (data.length > 0) {
          setSelectedPatient(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const\
