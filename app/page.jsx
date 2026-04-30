"use client";

import { useMemo, useState } from "react";

const questions = [
  {
    text: "In the last 30 days, which of these best describes how you've spent your time?",
    options: {
      A: "Mostly exploring different things and consuming content",
      B: "Learning consistently with some structure",
      C: "Trying out small ideas or experiments",
      D: "Working on something with a clear output or result",
    },
  },
  {
    text: "When you get interested in a new idea, what usually happens after a few days?",
    options: {
      A: "You shift attention to something else",
      B: "You continue thinking about it",
      C: "You take a small step to explore it",
      D: "You make measurable progress on it",
    },
  },
  {
    text: "You get an opportunity slightly beyond your current skill level.",
    options: {
      A: "You prefer to prepare more before taking it",
      B: "You take time before getting started",
      C: "You try it while staying within comfort",
      D: "You take it and figure things out along the way",
    },
  },
  {
    text: "When you're stuck on something, what do you usually do?",
    options: {
      A: "Step away and revisit later",
      B: "Look for guidance or direction",
      C: "Try a few approaches and see what works",
      D: "Keep working until something moves forward",
    },
  },
  {
    text: "You get a few hours of free time. How do you usually use it?",
    options: {
      A: "Unwind or reset",
      B: "Learn something useful",
      C: "Spend some time on a task or idea",
      D: "Focus on progressing one specific thing",
    },
  },
  {
    text: "A team project you're part of isn't progressing well.",
    options: {
      A: "Focus on your own responsibilities",
      B: "Share concerns with others",
      C: "Try to push things forward where possible",
      D: "Step in to create direction or momentum",
    },
  },
  {
    text: "You realize your current approach isn't working.",
    options: {
      A: "Pause and reassess before continuing",
      B: "Continue a bit longer to confirm",
      C: "Adjust parts of your approach",
      D: "Change direction and move forward quickly",
    },
  },
  {
    text: "You have multiple ideas but limited time.",
    options: {
      A: "Explore a few to understand them better",
      B: "Think through which might work best",
      C: "Start one while keeping others in mind",
      D: "Choose one and commit your focus",
    },
  },
  {
    text: "You might miss a commitment or deadline.",
    options: {
      A: "Try to complete it before saying anything",
      B: "Inform once you're certain",
      C: "Inform and discuss next steps",
      D: "Inform early and adjust with a clear plan",
    },
  },
  {
    text: "You need a skill quickly, like design, coding, or outreach.",
    options: {
      A: "Wait until you can learn it properly",
      B: "Look for someone else to help",
      C: "Learn enough to attempt it",
      D: "Learn and apply immediately",
    },
  },
  {
    text: "You put something out and get little or no response.",
    options: {
      A: "Let it run for a while as is",
      B: "Move on to something else",
      C: "Think about possible improvements",
      D: "Test changes and iterate",
    },
  },
  {
    text: "You're working on something repetitive or less interesting.",
    options: {
      A: "Space it out over time",
      B: "Do small parts when possible",
      C: "Work through it steadily",
      D: "Complete it in a focused block",
    },
  },
  {
    text: "Something you worked on didn't go as expected.",
    options: {
      A: "External factors affected the outcome",
      B: "Multiple things contributed to it",
      C: "There are parts you would handle differently",
      D: "You take responsibility and extract lessons",
    },
  },
  {
    text: "You receive direct critical feedback.",
    options: {
      A: "Reflect on how it was delivered",
      B: "Consider some of the points",
      C: "Evaluate it objectively",
      D: "Actively apply what's useful",
    },
  },
  {
    text: "A teammate is underperforming.",
    options: {
      A: "Focus on your own work",
      B: "Discuss it with others",
      C: "Adjust your workflow around it",
      D: "Address it directly with them",
    },
  },
  {
    text: "You have multiple ideas and limited time.",
    options: {
      A: "Explore a few directions",
      B: "Evaluate before committing",
      C: "Start one while keeping flexibility",
      D: "Commit to one direction",
    },
  },
  {
    text: "You need to make a decision with limited information.",
    options: {
      A: "Wait for more clarity",
      B: "Seek input from others",
      C: "Make a cautious call",
      D: "Gather key inputs and decide",
    },
  },
  {
    text: "Someone else is already working on a similar idea.",
    options: {
      A: "Look for a different idea",
      B: "Reconsider your approach",
      C: "Modify your version",
      D: "Study them and find your angle",
    },
  },
  {
    text: "You join a group of highly capable people.",
    options: {
      A: "Observe first",
      B: "Participate occasionally",
      C: "Engage when needed",
      D: "Contribute actively",
    },
  },
  {
    text: "After joining this club, what are you most likely to do?",
    options: {
      A: "Explore and observe",
      B: "Engage occasionally",
      C: "Participate when relevant",
      D: "Actively contribute or collaborate",
    },
  },
];

const roles = ["Student", "Employed", "Founder", "Freelancer", "Creator", "Other"];
const totalSteps = questions.length + 3;

const initialApplicant = {
  name: "",
  email: "",
  phone: "",
  role: "",
  roleOther: "",
  profileUrl: "",
};

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value) {
  try {
    const url = new URL(normalizeUrl(value));
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [applicant, setApplicant] = useState(initialApplicant);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedRole = applicant.role === "Other" ? applicant.roleOther.trim() : applicant.role;
  const questionIndex = step - 3;
  const isQuestionStep = step >= 3 && step < totalSteps;

  const progress = useMemo(() => {
    if (submitted) return 100;
    return Math.max(5, Math.round(((step + 1) / totalSteps) * 100));
  }, [step, submitted]);

  const stepLabel = useMemo(() => {
    if (submitted) return "Complete";
    if (step === 0) return "Introduction";
    if (step === 1) return "Identity";
    if (step === 2) return "Profile";
    return `Question ${step - 2}`;
  }, [step, submitted]);

  function updateApplicant(field, value) {
    setApplicant((current) => ({ ...current, [field]: value }));
  }

  function updateAnswer(value) {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = value;
      return next;
    });
  }

  function validateStep() {
    if (step === 1) {
      if (applicant.name.trim().length < 2) return "Enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email.trim())) {
        return "Enter a valid email.";
      }
      if (applicant.phone.trim().length < 7) {
        return "Enter a valid phone number.";
      }
      if (!applicant.role) return "Select what you currently are.";
      if (applicant.role === "Other" && applicant.roleOther.trim().length < 2) {
        return "Add your current role.";
      }
    }

    if (step === 2 && !isValidUrl(applicant.profileUrl)) {
      return "Add a valid LinkedIn or portfolio link.";
    }

    if (isQuestionStep && !answers[questionIndex]) {
      return "Choose one answer.";
    }

    return "";
  }

  async function submitApplication() {
    const payload = {
      applicant: {
        name: applicant.name.trim(),
        email: applicant.email.trim(),
        phone: applicant.phone ? applicant.phone.trim() : "",
        role: selectedRole,
        profileUrl: normalizeUrl(applicant.profileUrl),
      },
      answers: questions.map((question, index) => ({
        question: question.text,
        answer: answers[index],
        response: question.options[answers[index]],
      })),
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("foundersClubApplication", JSON.stringify(payload));
    
    try {
      const { submitApplicationAction } = await import("./actions");
      const result = await submitApplicationAction(payload);
      if (!result.success) {
        console.error(result.error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Error submitting to Sheets", e);
      return false;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const message = validateStep();

    if (message) {
      setError(message);
      return;
    }

    setError("");

    if (step === totalSteps - 1) {
      const success = await submitApplication();
      if (success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("Failed to submit application to database. Please try again.");
      }
      return;
    }

    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startOver() {
    setStep(0);
    setApplicant(initialApplicant);
    setAnswers(Array(questions.length).fill(""));
    setError("");
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell">
      <section className={`club-panel ${step > 0 ? "mobile-hidden" : ""}`} aria-label="Founder's Club">
        <div>
          <div className="club-mark" aria-hidden="true">
            FC
          </div>
          <p className="kicker">Founder's Club</p>
          <h1>Intake for high-agency individuals</h1>
          <p className="club-copy">
            A curated network where high-agency people come together.
          </p>
        </div>

        <div className="signal-strip" aria-hidden="true">
        </div>
      </section>

      <section className="intake-panel" aria-label="Application questions">
        <div className="progress-area">
          <div>
            <p className="step-label">{stepLabel}</p>
            <p className="step-meta">
              {submitted ? "Application submitted" : `Step ${step + 1} of ${totalSteps}`}
            </p>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        {submitted ? (
          <CompletionScreen applicantName={applicant.name} onStartOver={startOver} />
        ) : (
          <form className="intake-form" onSubmit={handleSubmit} noValidate>
            <div className="stage" aria-live="polite">
              {step === 0 && <IntroStep />}
              
              {step === 1 && (
                <IdentityStep
                  applicant={applicant}
                  roles={roles}
                  onChange={updateApplicant}
                />
              )}

              {step === 2 && (
                <ProfileStep
                  profileUrl={applicant.profileUrl}
                  onChange={(value) => updateApplicant("profileUrl", value)}
                />
              )}

              {isQuestionStep && (
                <QuestionStep
                  answer={answers[questionIndex]}
                  index={questionIndex}
                  question={questions[questionIndex]}
                  onAnswer={updateAnswer}
                />
              )}
            </div>

            <p className="form-error" role="alert">
              {error}
            </p>

            <div className="form-actions">
              <button
                className="ghost-button"
                disabled={step === 0}
                type="button"
                onClick={goBack}
              >
                Back
              </button>
              <button className="primary-button" type="submit">
                <span>
                  {step === 0
                    ? "Enter details"
                    : step === 2
                      ? "Start questions"
                      : step === totalSteps - 1
                        ? "Submit application"
                        : "Continue"}
                </span>
                <span className="button-icon">↗</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

function IdentityStep({ applicant, roles, onChange }) {
  return (
    <>
      <div className="stage-header">
        <p className="question-count">Applicant details</p>
        <h2>Start with the essentials.</h2>
        <p>
          Founder's Club looks for people who move with intent. This intake begins
          with your basic context.
        </p>
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            autoComplete="name"
            id="name"
            name="name"
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Your full name"
            type="text"
            value={applicant.name}
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={applicant.email}
          />
        </div>

        <div className="field full">
          <label htmlFor="phone">Phone number</label>
          <input
            autoComplete="tel"
            id="phone"
            name="phone"
            onChange={(event) => onChange("phone", event.target.value)}
            placeholder="+1 (555) 000-0000"
            type="tel"
            value={applicant.phone || ""}
          />
        </div>

        <fieldset className="field full">
          <legend className="choice-label">Currently, you are</legend>
          <div className="choice-grid">
            {roles.map((role) => {
              const id = `role-${role.toLowerCase()}`;
              return (
                <label className="role-choice" htmlFor={id} key={role}>
                  <input
                    checked={applicant.role === role}
                    id={id}
                    name="role"
                    onChange={() => onChange("role", role)}
                    type="radio"
                    value={role}
                  />
                  <span>{role}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {applicant.role === "Other" && (
          <div className="field full fade-in">
            <label htmlFor="roleOther">Current role</label>
            <input
              autoComplete="organization-title"
              id="roleOther"
              name="roleOther"
              onChange={(event) => onChange("roleOther", event.target.value)}
              placeholder="Tell us what fits best"
              type="text"
              value={applicant.roleOther}
            />
          </div>
        )}
      </div>
    </>
  );
}

function ProfileStep({ profileUrl, onChange }) {
  return (
    <>
      <div className="stage-header">
        <p className="question-count">Public proof</p>
        <h2>Share your LinkedIn or portfolio.</h2>
        <p>
          One useful link is enough. It can be LinkedIn, a personal site, a
          shipped project, a GitHub profile, or a portfolio.
        </p>
      </div>

      <div className="field-grid">
        <div className="field full">
          <label htmlFor="profileUrl">LinkedIn or portfolio website</label>
          <input
            autoComplete="url"
            id="profileUrl"
            inputMode="url"
            name="profileUrl"
            onChange={(event) => onChange(event.target.value)}
            placeholder="linkedin.com/in/yourname"
            type="url"
            value={profileUrl}
          />
        </div>
      </div>

    </>
  );
}

function QuestionStep({ answer, index, question, onAnswer }) {
  return (
    <>
      <div className="stage-header">
        <p className="question-count">
          Question {index + 1} of {questions.length}
        </p>
        <h2>{question.text}</h2>
      </div>

      <fieldset className="answers">
        <legend className="sr-only">Choose one answer</legend>
        {Object.entries(question.options).map(([key, text]) => {
          const id = `question-${index}-${key}`;
          return (
            <label className="answer-choice" htmlFor={id} key={key}>
              <input
                checked={answer === key}
                id={id}
                name="answer"
                onChange={() => onAnswer(key)}
                type="radio"
                value={key}
              />
              <span>
                <b className="answer-key">{key}</b>
                <span className="answer-text">{text}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
    </>
  );
}

function CompletionScreen({ applicantName, onStartOver }) {
  return (
    <div className="completion stage" aria-live="polite">
      <div className="stage-header">
        <p className="question-count">Application received</p>
        <h2>Thanks{applicantName.trim() ? `, ${applicantName.trim()}` : ""}.</h2>
        <p>
          Your Founder's Club intake has been submitted for private review. The
          questionnaire is used only to understand fit, context, and contribution
          style.
        </p>
      </div>

      <div className="private-note">
        <span aria-hidden="true">FC</span>
        <div>
          <strong>Private review only.</strong>
          <p>
            Responses are kept as context for the club team to understand fit,
            direction, and contribution style.
          </p>
        </div>
      </div>

      <button className="ghost-button compact-button" type="button" onClick={onStartOver}>
        Start a new application
      </button>
    </div>
  );
}

function IntroStep() {
  return (
    <>
      <div className="stage-header">
        <p className="question-count">Welcome</p>
        <h2 style={{ marginBottom: "48px" }}>Before you begin.</h2>
      </div>
      
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "32px", maxWidth: "480px" }}>
        <li style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <span style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: "500", opacity: 0.5 }}>01</span>
          <div>
            <strong style={{ color: "var(--text-primary)", fontSize: "1.1rem", display: "block", marginBottom: "6px", fontWeight: "500" }}>
              20 Questions
            </strong>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6" }}>
              The questionnaire is brief and focused. It should take you about 5 minutes to complete.
            </p>
          </div>
        </li>
        <li style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <span style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: "500", opacity: 0.5 }}>02</span>
          <div>
            <strong style={{ color: "var(--text-primary)", fontSize: "1.1rem", display: "block", marginBottom: "6px", fontWeight: "500" }}>
              No wrong answers
            </strong>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6" }}>
              We aren't grading you. Follow your first instinct to give us an accurate reflection of your style.
            </p>
          </div>
        </li>
        <li style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <span style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: "500", opacity: 0.5 }}>03</span>
          <div>
            <strong style={{ color: "var(--text-primary)", fontSize: "1.1rem", display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Radical honesty
            </strong>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6" }}>
              Providing the truest version of yourself ensures we can offer the right support for your specific journey.
            </p>
          </div>
        </li>
      </ul>
    </>
  );
}
