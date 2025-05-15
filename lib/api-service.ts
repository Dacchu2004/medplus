// This is a mock API service
// In a real application, this would connect to a backend API

// Doctor Dashboard Data
export async function fetchDoctorDashboardData() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        todayAppointments: 8,
        appointmentChange: "+2",
        pendingConsultations: 4,
        consultationChange: "-1",
        totalPatients: 145,
        patientChange: "+5",
        emergencyRequests: 2,
        emergencyChange: "+1",
        todaySchedule: [
          {
            id: 1,
            patientName: "John Doe",
            time: "09:00 AM",
            type: "Check-up",
            status: "Confirmed",
          },
          {
            id: 2,
            patientName: "Jane Smith",
            time: "10:30 AM",
            type: "Follow-up",
            status: "Confirmed",
          },
          {
            id: 3,
            patientName: "Robert Johnson",
            time: "01:00 PM",
            type: "Consultation",
            status: "Pending",
          },
          {
            id: 4,
            patientName: "Emily Davis",
            time: "03:30 PM",
            type: "Check-up",
            status: "Confirmed",
          },
        ],
        recentActivity: [
          {
            id: 1,
            patientName: "Sarah Wilson",
            action: "Updated health vitals",
            time: "2 hours ago",
          },
          {
            id: 2,
            patientName: "Michael Brown",
            action: "Requested prescription refill",
            time: "4 hours ago",
          },
          {
            id: 3,
            patientName: "Lisa Taylor",
            action: "Booked an appointment",
            time: "Yesterday",
          },
          {
            id: 4,
            patientName: "David Miller",
            action: "Sent a message",
            time: "Yesterday",
          },
        ],
      })
    }, 1000)
  })
}

// Patient Dashboard Data
export async function fetchPatientDashboardData() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        upcomingAppointments: 2,
        prescriptions: 3,
        messages: 1,
        vitalsData: {
          bloodPressure: [
            { date: "2023-01-01", value: 120 },
            { date: "2023-02-01", value: 118 },
            { date: "2023-03-01", value: 122 },
            { date: "2023-04-01", value: 119 },
            { date: "2023-05-01", value: 121 },
            { date: "2023-06-01", value: 117 },
          ],
          heartRate: [
            { date: "2023-01-01", value: 72 },
            { date: "2023-02-01", value: 74 },
            { date: "2023-03-01", value: 70 },
            { date: "2023-04-01", value: 73 },
            { date: "2023-05-01", value: 71 },
            { date: "2023-06-01", value: 72 },
          ],
          bloodSugar: [
            { date: "2023-01-01", value: 95 },
            { date: "2023-02-01", value: 98 },
            { date: "2023-03-01", value: 92 },
            { date: "2023-04-01", value: 97 },
            { date: "2023-05-01", value: 94 },
            { date: "2023-06-01", value: 96 },
          ],
        },
        appointments: [
          {
            id: 1,
            doctorName: "Dr. Jane Smith",
            date: "2023-06-15",
            time: "10:00 AM",
            type: "Check-up",
            status: "Upcoming",
          },
          {
            id: 2,
            doctorName: "Dr. Robert Johnson",
            date: "2023-06-22",
            time: "02:30 PM",
            type: "Follow-up",
            status: "Upcoming",
          },
          {
            id: 3,
            doctorName: "Dr. Jane Smith",
            date: "2023-05-10",
            time: "11:00 AM",
            type: "Check-up",
            status: "Completed",
          },
        ],
        prescriptionList: [
          {
            id: 1,
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "3 times daily",
            duration: "7 days",
            prescribedBy: "Dr. Jane Smith",
            date: "2023-05-10",
            cost: 25.99,
          },
          {
            id: 2,
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "30 days",
            prescribedBy: "Dr. Robert Johnson",
            date: "2023-04-22",
            cost: 15.5,
          },
          {
            id: 3,
            name: "Ibuprofen",
            dosage: "400mg",
            frequency: "As needed",
            duration: "PRN",
            prescribedBy: "Dr. Jane Smith",
            date: "2023-05-10",
            cost: 8.75,
          },
        ],
      })
    }, 1000)
  })
}

// Doctor Appointments
export async function fetchDoctorAppointments() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          patientName: "John Doe",
          patientId: "PAT001",
          date: "2023-06-15",
          time: "09:00 AM",
          type: "Check-up",
          status: "Confirmed",
          notes: "Regular check-up, patient has history of hypertension",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          patientId: "PAT002",
          date: "2023-06-15",
          time: "10:30 AM",
          type: "Follow-up",
          status: "Confirmed",
          notes: "Follow-up on medication adjustment",
        },
        {
          id: 3,
          patientName: "Robert Johnson",
          patientId: "PAT003",
          date: "2023-06-15",
          time: "01:00 PM",
          type: "Consultation",
          status: "Pending",
          notes: "New patient consultation",
        },
        {
          id: 4,
          patientName: "Emily Davis",
          patientId: "PAT004",
          date: "2023-06-15",
          time: "03:30 PM",
          type: "Check-up",
          status: "Confirmed",
          notes: "Annual physical examination",
        },
        {
          id: 5,
          patientName: "Michael Wilson",
          patientId: "PAT005",
          date: "2023-06-16",
          time: "09:30 AM",
          type: "Follow-up",
          status: "Confirmed",
          notes: "Post-surgery follow-up",
        },
        {
          id: 6,
          patientName: "Sarah Brown",
          patientId: "PAT006",
          date: "2023-06-16",
          time: "11:00 AM",
          type: "Consultation",
          status: "Confirmed",
          notes: "Discussing test results",
        },
        {
          id: 7,
          patientName: "David Miller",
          patientId: "PAT007",
          date: "2023-06-16",
          time: "02:00 PM",
          type: "Check-up",
          status: "Pending",
          notes: "Regular check-up",
        },
        {
          id: 8,
          patientName: "Lisa Taylor",
          patientId: "PAT008",
          date: "2023-06-16",
          time: "04:00 PM",
          type: "Follow-up",
          status: "Confirmed",
          notes: "Medication review",
        },
      ])
    }, 1000)
  })
}

// Patient List
export async function fetchPatientList() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "PAT001",
          name: "John Doe",
          age: 45,
          gender: "Male",
          phone: "555-123-4567",
          email: "john.doe@example.com",
          lastVisit: "2023-05-10",
          conditions: ["Hypertension", "Type 2 Diabetes"],
        },
        {
          id: "PAT002",
          name: "Jane Smith",
          age: 38,
          gender: "Female",
          phone: "555-234-5678",
          email: "jane.smith@example.com",
          lastVisit: "2023-05-15",
          conditions: ["Asthma"],
        },
        {
          id: "PAT003",
          name: "Robert Johnson",
          age: 52,
          gender: "Male",
          phone: "555-345-6789",
          email: "robert.johnson@example.com",
          lastVisit: "2023-04-22",
          conditions: ["Arthritis", "High Cholesterol"],
        },
        {
          id: "PAT004",
          name: "Emily Davis",
          age: 29,
          gender: "Female",
          phone: "555-456-7890",
          email: "emily.davis@example.com",
          lastVisit: "2023-06-01",
          conditions: ["Migraine"],
        },
        {
          id: "PAT005",
          name: "Michael Wilson",
          age: 61,
          gender: "Male",
          phone: "555-567-8901",
          email: "michael.wilson@example.com",
          lastVisit: "2023-05-20",
          conditions: ["Coronary Artery Disease", "Hypertension"],
        },
        {
          id: "PAT006",
          name: "Sarah Brown",
          age: 42,
          gender: "Female",
          phone: "555-678-9012",
          email: "sarah.brown@example.com",
          lastVisit: "2023-05-05",
          conditions: ["Hypothyroidism"],
        },
        {
          id: "PAT007",
          name: "David Miller",
          age: 35,
          gender: "Male",
          phone: "555-789-0123",
          email: "david.miller@example.com",
          lastVisit: "2023-04-15",
          conditions: ["Anxiety", "Depression"],
        },
        {
          id: "PAT008",
          name: "Lisa Taylor",
          age: 48,
          gender: "Female",
          phone: "555-890-1234",
          email: "lisa.taylor@example.com",
          lastVisit: "2023-05-25",
          conditions: ["Fibromyalgia", "Insomnia"],
        },
      ])
    }, 1000)
  })
}

// Patient Details
export async function fetchPatientDetails(patientId: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const patients = {
        PAT001: {
          id: "PAT001",
          name: "John Doe",
          age: 45,
          gender: "Male",
          dob: "1978-03-15",
          phone: "555-123-4567",
          email: "john.doe@example.com",
          address: "123 Main St, Anytown, USA",
          emergencyContact: "Jane Doe (Wife) - 555-123-4568",
          insurance: "Blue Cross Blue Shield",
          insuranceId: "BCBS12345678",
          bloodType: "O+",
          allergies: ["Penicillin", "Peanuts"],
          conditions: ["Hypertension", "Type 2 Diabetes"],
          medications: [
            {
              name: "Lisinopril",
              dosage: "10mg",
              frequency: "Once daily",
              startDate: "2022-01-15",
            },
            {
              name: "Metformin",
              dosage: "500mg",
              frequency: "Twice daily",
              startDate: "2022-02-10",
            },
          ],
          visits: [
            {
              date: "2023-05-10",
              reason: "Regular check-up",
              diagnosis: "Stable hypertension, well-controlled diabetes",
              treatment: "Continue current medications",
              doctor: "Dr. Jane Smith",
            },
            {
              date: "2023-02-15",
              reason: "Flu symptoms",
              diagnosis: "Seasonal influenza",
              treatment: "Rest, fluids, Tamiflu prescribed",
              doctor: "Dr. Robert Johnson",
            },
            {
              date: "2022-11-20",
              reason: "Annual physical",
              diagnosis: "Generally healthy, slight elevation in blood pressure",
              treatment: "Adjusted Lisinopril dosage",
              doctor: "Dr. Jane Smith",
            },
          ],
          vitals: [
            {
              date: "2023-05-10",
              bloodPressure: "130/85",
              heartRate: 72,
              temperature: 98.6,
              respiratoryRate: 16,
              bloodSugar: 110,
              weight: 185,
              height: 5.1,
            },
            {
              date: "2023-02-15",
              bloodPressure: "145/90",
              heartRate: 88,
              temperature: 101.2,
              respiratoryRate: 20,
              bloodSugar: 130,
              weight: 187,
              height: 5.1,
            },
            {
              date: "2022-11-20",
              bloodPressure: "140/88",
              heartRate: 74,
              temperature: 98.4,
              respiratoryRate: 16,
              bloodSugar: 115,
              weight: 190,
              height: 5.1,
            },
          ],
          notes: [
            {
              date: "2023-05-10",
              content: "Patient reports feeling well. Compliant with medications. Exercising 3 times per week.",
              author: "Dr. Jane Smith",
            },
            {
              date: "2023-02-15",
              content:
                "Patient presented with fever, cough, and body aches for 2 days. Tested positive for influenza A.",
              author: "Dr. Robert Johnson",
            },
            {
              date: "2022-11-20",
              content:
                "Annual physical examination. Patient reports occasional headaches. Recommended reducing sodium intake and increasing physical activity.",
              author: "Dr. Jane Smith",
            },
          ],
        },
        // Add more patients as needed
      }

      resolve(patients[patientId as keyof typeof patients] || null)
    }, 1000)
  })
}

// Add Appointment
export async function addAppointment(appointmentData: any) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        ...appointmentData,
        status: "Confirmed",
      })
    }, 1000)
  })
}

// Add Patient Note
export async function addPatientNote(patientId: string, note: any) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        date: new Date().toISOString().split("T")[0],
        ...note,
      })
    }, 1000)
  })
}

// Add Patient Vitals
export async function addPatientVitals(patientId: string, vitals: any) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        date: new Date().toISOString().split("T")[0],
        ...vitals,
      })
    }, 1000)
  })
}

// Add Prescription
export async function addPrescription(patientId: string, prescription: any) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        date: new Date().toISOString().split("T")[0],
        ...prescription,
      })
    }, 1000)
  })
}

// Get First Aid Information
export async function getFirstAidInfo(query: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const firstAidData = {
        burn: {
          title: "Burn Treatment",
          steps: [
            "Cool the burn with cool (not cold) running water for 10 to 15 minutes or until pain eases.",
            "Remove jewelry and tight items from the burned area.",
            "Don't break blisters. If blisters break, clean with mild soap and water.",
            "Apply an antibiotic ointment and cover with a sterile bandage.",
            "Take an over-the-counter pain reliever if needed.",
            "Seek medical attention for severe burns or burns on the face, hands, feet, genitals, or over a joint.",
          ],
          videoLinks: ["https://www.youtube.com/watch?v=EaJmzB8YgS0"],
          images: ["/placeholder.svg?height=300&width=400"],
        },
        seizure: {
          title: "Seizure First Aid",
          steps: [
            "Stay with the person and time the seizure.",
            "Clear the area of anything that could harm the person.",
            "Put something soft under their head.",
            "Turn them onto their side if possible.",
            "Don't restrain the person or put anything in their mouth.",
            "Call emergency services if the seizure lasts more than 5 minutes, if the person doesn't wake up, or if they have another seizure.",
          ],
          videoLinks: ["https://www.youtube.com/watch?v=5QlXkj5C1jA"],
          images: ["/placeholder.svg?height=300&width=400"],
        },
        choking: {
          title: "Choking First Aid",
          steps: [
            "Ask the person if they're choking. If they can speak, cough, or breathe, don't interfere.",
            "If they can't speak, cough, or breathe, give 5 back blows between the shoulder blades with the heel of your hand.",
            "If back blows don't work, give 5 abdominal thrusts (Heimlich maneuver).",
            "Alternate between 5 back blows and 5 abdominal thrusts until the object is dislodged or emergency services arrive.",
            "If the person becomes unconscious, start CPR.",
          ],
          videoLinks: ["https://www.youtube.com/watch?v=PA9hpOnvtCk"],
          images: ["/placeholder.svg?height=300&width=400"],
        },
        "heart attack": {
          title: "Heart Attack First Aid",
          steps: [
            "Call emergency services immediately.",
            "Have the person sit down and rest in a position that makes breathing comfortable.",
            "Loosen any tight clothing.",
            "If the person is not allergic to aspirin and has no other contraindications, give them an aspirin to chew.",
            "If the person becomes unconscious, begin CPR if you're trained.",
            "If an automated external defibrillator (AED) is available, use it following the instructions.",
          ],
          videoLinks: ["https://www.youtube.com/watch?v=gDwt7dD3awc"],
          images: ["/placeholder.svg?height=300&width=400"],
        },
        bleeding: {
          title: "Severe Bleeding First Aid",
          steps: [
            "Apply direct pressure on the wound with a clean cloth, bandage, or piece of clothing.",
            "If possible, elevate the injured area above the level of the heart.",
            "If blood soaks through, add more material on top (don't remove the first layer).",
            "If bleeding continues and you suspect an arterial bleed, apply pressure to the appropriate pressure point.",
            "Use a tourniquet only as a last resort for life-threatening bleeding that can't be controlled by other means.",
            "Call emergency services or get the person to emergency care as soon as possible.",
          ],
          videoLinks: ["https://www.youtube.com/watch?v=NxO5LvgqZe0"],
          images: ["/placeholder.svg?height=300&width=400"],
        },
      }

      // Default response if query doesn't match
      let response = {
        title: "First Aid Information",
        steps: [
          "For specific first aid instructions, please search for a specific condition like 'burn', 'seizure', 'choking', etc.",
          "In case of a medical emergency, always call emergency services immediately.",
          "This tool provides basic first aid guidance only and is not a substitute for professional medical care.",
        ],
        videoLinks: [],
        images: ["/placeholder.svg?height=300&width=400"],
      }

      // Find matching first aid information
      const keys = Object.keys(firstAidData)
      for (const key of keys) {
        if (query.toLowerCase().includes(key)) {
          response = firstAidData[key as keyof typeof firstAidData]
          break
        }
      }

      resolve(response)
    }, 1000)
  })
}

// Chat Messages
export async function fetchChatMessages(conversationId: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          sender: "patient",
          senderName: "John Doe",
          content: "Hello doctor, I've been experiencing severe headaches for the past few days.",
          timestamp: "2023-06-14T10:30:00Z",
        },
        {
          id: 2,
          sender: "doctor",
          senderName: "Dr. Jane Smith",
          content: "I'm sorry to hear that. Can you describe the pain? Is it constant or does it come and go?",
          timestamp: "2023-06-14T10:32:00Z",
        },
        {
          id: 3,
          sender: "patient",
          senderName: "John Doe",
          content: "It's mostly in the afternoon and evening. The pain is throbbing and on one side of my head.",
          timestamp: "2023-06-14T10:35:00Z",
        },
        {
          id: 4,
          sender: "doctor",
          senderName: "Dr. Jane Smith",
          content: "That sounds like it could be a migraine. Have you experienced any sensitivity to light or sound?",
          timestamp: "2023-06-14T10:37:00Z",
        },
        {
          id: 5,
          sender: "patient",
          senderName: "John Doe",
          content: "Yes, bright lights make it worse. I've also felt a bit nauseous.",
          timestamp: "2023-06-14T10:40:00Z",
        },
        {
          id: 6,
          sender: "doctor",
          senderName: "Dr. Jane Smith",
          content:
            "Those are common migraine symptoms. I'd like to see you in person to confirm. Can you come in tomorrow?",
          timestamp: "2023-06-14T10:42:00Z",
        },
        {
          id: 7,
          sender: "patient",
          senderName: "John Doe",
          content: "Yes, I can come in tomorrow afternoon.",
          timestamp: "2023-06-14T10:45:00Z",
        },
        {
          id: 8,
          sender: "doctor",
          senderName: "Dr. Jane Smith",
          content:
            "Great. In the meantime, try to rest in a dark, quiet room and stay hydrated. You can take over-the-counter pain relievers if needed.",
          timestamp: "2023-06-14T10:47:00Z",
        },
      ])
    }, 1000)
  })
}

// Send Chat Message
export async function sendChatMessage(conversationId: string, message: any) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString(),
        ...message,
      })
    }, 500)
  })
}

// Get AI Chat Response
export async function getAIChatResponse(message: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple responses based on keywords
      let response = "I'm sorry, I don't understand. Could you please provide more details about your symptoms?"

      if (message.toLowerCase().includes("headache")) {
        response =
          "Headaches can be caused by various factors including stress, dehydration, or lack of sleep. For mild headaches, you can try over-the-counter pain relievers, rest in a quiet dark room, and stay hydrated. If your headache is severe, sudden, or accompanied by other symptoms like fever or stiff neck, please seek immediate medical attention."
      } else if (message.toLowerCase().includes("fever")) {
        response =
          "Fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and take over-the-counter fever reducers like acetaminophen or ibuprofen if needed. If your fever is very high (above 103°F or 39.4°C), persists for more than three days, or is accompanied by severe symptoms, please consult a healthcare provider."
      } else if (message.toLowerCase().includes("cough")) {
        response =
          "For a cough, stay hydrated and try honey (if over 1 year old) or over-the-counter cough suppressants. If your cough is severe, produces thick green or yellow phlegm, or is accompanied by shortness of breath, please consult a healthcare provider."
      } else if (message.toLowerCase().includes("pain")) {
        response =
          "I'm sorry you're experiencing pain. The treatment depends on the location and type of pain. Rest, ice, compression, and elevation (RICE) can help with many types of pain. Over-the-counter pain relievers may also help. If the pain is severe, worsening, or interfering with daily activities, please consult a healthcare provider."
      }

      resolve({
        id: Math.floor(Math.random() * 1000),
        sender: "ai",
        senderName: "MediConnect AI",
        content: response,
        timestamp: new Date().toISOString(),
      })
    }, 1000)
  })
}

// Transcribe Audio
export async function transcribeAudio(audioBlob: Blob) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "Patient reports experiencing headaches for the past week, primarily in the evenings. No previous history of migraines. Currently not taking any medications. Recommending over-the-counter pain relievers and to monitor symptoms. Follow-up in two weeks if symptoms persist.",
        structuredData: {
          patientName: "John Doe",
          doctorName: "Dr. Jane Smith",
          symptoms: ["headaches", "evening onset", "no previous history"],
          suggestions: ["over-the-counter pain relievers", "monitor symptoms"],
          medications: [],
          followUp: "two weeks if symptoms persist",
          timestamp: new Date().toISOString(),
        },
      })
    }, 2000)
  })
}

// Update User Settings
export async function updateUserSettings(userId: string, settings: any) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Settings updated successfully",
        updatedSettings: settings,
      })
    }, 1000)
  })
}

// Generate PDF
export async function generatePatientSummaryPDF(patientId: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "PDF generated successfully",
        url: "/sample-patient-summary.pdf", // This would be a real URL in production
      })
    }, 2000)
  })
}
