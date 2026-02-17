import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Plus,
	Brain,
	LogOut,
	X as CloseIcon,
	MoreVertical,
	Settings,
	Sun,
	Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../supabaseClient";
import ragApi from "../services/ragApi";

export default function DashboardHome() {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [courseTitle, setCourseTitle] = useState("");
	const [courses, setCourses] = useState([]);
	const [activeMenu, setActiveMenu] = useState(null);
	const [editingCourseId, setEditingCourseId] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [courseToDelete, setCourseToDelete] = useState(null); // { id, title }
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const { theme, setTheme, isDark } = useTheme();

	// API integration states
	const [userId, setUserId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Get user ID from Supabase auth on mount
	useEffect(() => {
		const getUser = async () => {
			try {
				const { data: { user } } = await supabase.auth.getUser();
				if (user) {
					setUserId(user.id);
				} else {
					// No user logged in, redirect to login
					navigate('/login');
				}
			} catch (err) {
				console.error('Error getting user:', err);
				setError(err);
				navigate('/login');
			}
		};
		getUser();
	}, [navigate]);

	// Fetch topics when userId is available
	useEffect(() => {
		if (!userId) return;

		const loadTopics = async () => {
			setLoading(true);
			try {
				const { topics } = await ragApi.listTopics(userId);
				// Map API field 'name' to UI field 'title'
				const mapped = (topics || []).map(t => ({
					...t,
					title: t.name || t.title,
				}));
				setCourses(mapped);
				setError(null);
			} catch (err) {
				console.error('Failed to load topics:', err);
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		loadTopics();
	}, [userId]);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		localStorage.removeItem("user");
		navigate("/");
	};

	const handleCreateCourse = async (e) => {
		e.preventDefault();
		if (!courseTitle.trim()) {
			alert("Please enter a course title");
			return;
		}

		setIsCreating(true);

		// DIAGNOSTIC CHECK: Verify user exists in public.users
		try {
			const { data: userRecord, error: userError } = await supabase
				.from('users')
				.select('id')
				.eq('id', userId)
				.single();

			if (userError && userError.code !== 'PGRST116') {
				console.error("Error checking public.users:", userError);
			}

			if (!userRecord) {
				alert(
					`CRITICAL ERROR: Your user account (${userId}) is MISSING from the 'public.users' table.\n\n` +
					`This means the SQL Backfill script did not work or hasn't been run.\n` +
					`Please go to Supabase -> SQL Editor and run the 'supabase_user_sync_backfill.sql' script again.`
				);
				return;
			}
		} catch (err) {
			console.error("Diagnostic check failed:", err);
		}

		try {
			const newTopic = await ragApi.createTopic(userId, courseTitle, null);

			// Map API response (uses 'name') to UI format (uses 'title')
			const courseForUI = {
				...newTopic,
				title: newTopic.name || newTopic.title || courseTitle,
			};

			// Add to local state
			setCourses([courseForUI, ...courses]);
			setCourseTitle("");
			setShowModal(false);
			setIsCreating(false);
		} catch (err) {
			console.error('Failed to create topic:', err);

			// Check if it's a foreign key constraint error
			if (err.message.includes('foreign key constraint') || err.message.includes('user_id')) {
				alert(
					'User account not found in RAG BACKEND database.\n\n' +
					'DIAGNOSIS:\n' +
					'1. You DO exist in Supabase (we checked).\n' +
					'2. But the RAG Backend API is rejecting you.\n\n' +
					'CONCLUSION: The RAG Backend is likely connected to a DIFFERENT database or table.\n' +
					`Your user ID: ${userId}`
				);
			} else {
				alert(`Failed to create course: ${err.message}`);
			}
			setIsCreating(false);
		}
	};

	const handleCourseTile = (topicId, title) => {
		if (editingCourseId !== topicId && activeMenu !== topicId) {
			// Navigate to Dashboard with topicId
			navigate("/dashboard", { state: { topicId, courseTitle: title } });
		}
	};

	const handleEditClick = (e, courseId, currentTitle) => {
		e.stopPropagation();
		setEditingCourseId(courseId);
		setEditTitle(currentTitle);
		setActiveMenu(null);
	};

	const handleSaveEdit = (courseId) => {
		if (!editTitle.trim()) {
			alert("Course title cannot be empty");
			return;
		}
		setCourses(
			courses.map((course) =>
				course.id === courseId ? { ...course, title: editTitle } : course
			)
		);
		setEditingCourseId(null);
		setEditTitle("");
	};

	const handleCancelEdit = () => {
		setEditingCourseId(null);
		setEditTitle("");
	};

	const handleDeleteClick = (e, topicId, title) => {
		e.stopPropagation();
		setCourseToDelete({ id: topicId, title });
		setActiveMenu(null);
	};

	const handleConfirmDelete = async () => {
		if (!courseToDelete) return;
		setIsDeleting(true);
		try {
			await ragApi.deleteTopic(courseToDelete.id);
			setCourses(courses.filter((course) => course.id !== courseToDelete.id));
		} catch (err) {
			console.error('Failed to delete topic:', err);
			alert(`Failed to delete course: ${err.message}`);
		} finally {
			setIsDeleting(false);
			setCourseToDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setCourseToDelete(null);
	};

	const handleModeSelection = (mode) => {
		setTheme(mode);
		setIsSettingsOpen(false);
	};

	const headingColor = isDark ? "text-white" : "text-gray-800";
	const subheadingColor = isDark ? "text-slate-300" : "text-gray-600";
	const cardSurface = isDark
		? "bg-slate-900 border-slate-700 text-slate-100"
		: "bg-white border-gray-200 text-gray-800";
	const mutedText = isDark ? "text-slate-400" : "text-gray-500";
	const inputBorder = isDark
		? "border-slate-600 bg-slate-800 text-slate-100"
		: "border-gray-300 bg-white";

	return (
		<div
			className={`flex h-screen w-screen flex-col overflow-hidden font-sans transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-900"
				}`}
		>
			<header
				className={`flex items-center p-4 flex-shrink-0 border-b transition-colors ${isDark
					? "bg-slate-900 border-slate-800 shadow-[0_10px_30px_rgba(2,6,23,0.4)]"
					: "bg-white border-gray-200 shadow-sm"
					}`}
			>
				<div className="flex items-center gap-2">
					<Brain size={20} className="text-blue-500" />
					<h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
						IntelliLearn
					</h1>
				</div>
				<div className="ml-auto flex items-center gap-3 relative">
					<button
						onClick={() => setIsSettingsOpen((prev) => !prev)}
						className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${isDark
							? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
							: "border-gray-200 text-gray-700 hover:bg-gray-100"
							}`}
						aria-haspopup="true"
						aria-expanded={isSettingsOpen}
					>
						<Settings size={18} />
						<span>Settings</span>
					</button>

					{isSettingsOpen && (
						<div
							className={`absolute right-0 top-12 w-56 rounded-xl border shadow-xl z-20 transition-colors ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"
								}`}
						>
							<div className={`px-4 py-3 border-b ${isDark ? "border-slate-800" : "border-gray-100"}`}>
								<p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-400" : "text-gray-500"}`}>
									Mode
								</p>
								<div className="mt-3 flex gap-2">
									<button
										onClick={() => handleModeSelection("light")}
										className={`flex-1 flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${theme === "light"
											? "border-blue-500 bg-blue-50 text-blue-600"
											: isDark
												? "border-slate-700 text-slate-200 hover:bg-slate-800"
												: "border-gray-200 text-gray-600 hover:bg-gray-50"
											}`}
									>
										<Sun size={16} /> Light
									</button>
									<button
										onClick={() => handleModeSelection("dark")}
										className={`flex-1 flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${theme === "dark"
											? "border-blue-500 bg-blue-50 text-blue-600"
											: isDark
												? "border-slate-700 text-slate-200 hover:bg-slate-800"
												: "border-gray-200 text-gray-600 hover:bg-gray-50"
											}`}
									>
										<Moon size={16} /> Dark
									</button>
								</div>
							</div>
							<button
								onClick={() => {
									setIsSettingsOpen(false);
									handleLogout();
								}}
								className={`flex w-full items-center gap-2 px-4 py-3 text-left transition-colors ${isDark ? "text-red-300 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"
									}`}
							>
								<LogOut size={16} />
								Logout
							</button>
						</div>
					)}
				</div>
			</header>

			<div className="flex-1 flex flex-col h-screen overflow-hidden">
				<main className="flex-1 p-6 md:p-8 overflow-y-auto">
					<div className="max-w-6xl mx-auto">
						{/* Loading State */}
						{loading && (
							<div className="flex items-center justify-center h-64">
								<div className="text-center">
									{/* Animated Spinner */}
									<div className="relative mx-auto mb-6 w-16 h-16">
										<div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
										<div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
									</div>
									<p className={`text-lg font-medium ${subheadingColor}`}>Loading your courses</p>
									{/* Bouncing dots */}
									<div className="flex justify-center gap-1.5 mt-3">
										<span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
										<span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
										<span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
									</div>
								</div>
							</div>
						)}

						{/* Error State */}
						{error && !loading && (
							<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-600">Failed to load courses. Please try refreshing the page.</p>
							</div>
						)}

						{/* Content - Only show when not loading */}
						{!loading && (
							<>
								<div className="mb-8">
									<h2 className={`text-3xl md:text-4xl font-bold mb-2 ${headingColor}`}>
										My Courses
									</h2>
									<p className={subheadingColor}>Create and manage your learning courses</p>
								</div>

								<div className="mb-8">
									<button
										onClick={() => setShowModal(true)}
										className={`flex items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed transition-all duration-200 w-full sm:w-60 group ${isDark
											? "border-slate-600 bg-slate-900 hover:border-blue-500 hover:bg-blue-500/10"
											: "border-blue-400 hover:border-blue-600 hover:bg-blue-50"
											}`}
									>
										<div className="flex flex-col items-center gap-2">
											<Plus
												size={40}
												className={`transition-colors ${isDark ? "text-blue-400 group-hover:text-blue-300" : "text-blue-600 group-hover:text-blue-700"
													}`}
											/>
											<span className={`text-lg font-semibold transition-colors ${isDark ? "text-slate-100" : "text-gray-700"}`}>
												Create New Course
											</span>
										</div>
									</button>
								</div>

								{courses.length > 0 && (
									<div>
										<h3 className={`text-xl font-semibold mb-4 ${headingColor}`}>
											Your Courses
										</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
											{courses.map((course) => (
												<div
													key={course.id}
													onClick={() => handleCourseTile(course.id, course.title)}
													className={`relative p-6 rounded-lg border shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer group ${cardSurface}`}
												>
													<div className="absolute top-4 right-4">
														<button
															onClick={(e) => {
																e.stopPropagation();
																setActiveMenu(activeMenu === course.id ? null : course.id);
															}}
															className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg ${isDark
																? "text-slate-400 hover:text-white hover:bg-slate-800"
																: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
																}`}
														>
															<MoreVertical size={20} />
														</button>

														{activeMenu === course.id && (
															<div
																className={`absolute right-0 mt-2 w-40 rounded-lg border shadow-lg z-10 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
																	}`}
															>
																<button
																	onClick={(e) => handleEditClick(e, course.id, course.title)}
																	className={`w-full text-left px-4 py-2 transition-colors border-b ${isDark
																		? "text-slate-100 border-slate-800 hover:bg-slate-800"
																		: "text-gray-700 border-gray-200 hover:bg-gray-100"
																		}`}
																>
																	Edit
																</button>
																<button
																	onClick={(e) => handleDeleteClick(e, course.id, course.title)}
																	className={`w-full text-left px-4 py-2 transition-colors ${isDark ? "text-red-300 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"
																		}`}
																>
																	Delete
																</button>
															</div>
														)}
													</div>

													{editingCourseId === course.id ? (
														<div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
															<label className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-gray-700"}`}>
																Edit Course Title
															</label>
															<input
																type="text"
																value={editTitle}
																onChange={(e) => setEditTitle(e.target.value)}
																className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBorder}`}
																autoFocus
																onClick={(e) => e.stopPropagation()}
															/>
															<div className="flex gap-2">
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleSaveEdit(course.id);
																	}}
																	className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
																>
																	Save
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleCancelEdit();
																	}}
																	className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${isDark
																		? "border border-slate-600 text-slate-200 hover:bg-slate-800"
																		: "border border-gray-300 text-gray-700 hover:bg-gray-50"
																		}`}
																>
																	Cancel
																</button>
															</div>
														</div>
													) : (
														<>
															<div className="flex items-start gap-3 mb-4">
																<div
																	className={`p-3 rounded-lg transition-colors ${isDark ? "bg-blue-500/20" : "bg-blue-100"
																		}`}
																>
																	<Brain size={24} className="text-blue-500" />
																</div>
																<div className="flex-1 pr-8">
																	<h4
																		className={`font-semibold transition-colors line-clamp-2 ${isDark ? "text-slate-100" : "text-gray-800"
																			}`}
																	>
																		{course.title}
																	</h4>
																</div>
															</div>
															<p className={`text-sm ${mutedText}`}>
																Click to open course
															</p>
														</>
													)}
												</div>
											))}
										</div>
									</div>
								)}

								{courses.length === 0 && (
									<div
										className={`text-center py-12 rounded-2xl border transition-colors ${isDark ? "border-slate-800 bg-slate-900" : "border-dashed border-gray-200 bg-white"
											}`}
									>
										<Brain size={48} className={`mx-auto mb-4 ${isDark ? "text-slate-600" : "text-gray-300"}`} />
										<h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>
											No courses yet
										</h3>
										<p className={mutedText}>
											Click the "Create New Course" button above to get started
										</p>
									</div>
								)}
							</>
						)}
					</div>
				</main>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
					<div
						className={`rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white"
							}`}
					>
						<div className="flex items-center justify-between mb-6">
							<h3 className={`text-2xl font-bold ${headingColor}`}>
								Create New Course
							</h3>
							<button
								onClick={() => {
									setShowModal(false);
									setCourseTitle("");
								}}
								className={`p-1 rounded-full transition-colors ${isDark
									? "text-slate-400 hover:text-white hover:bg-slate-800"
									: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
									}`}
							>
								<CloseIcon size={20} />
							</button>
						</div>

						<form onSubmit={handleCreateCourse}>
							<div className="mb-6">
								<label className={`block text-sm font-semibold mb-2 ${headingColor}`}>
									Course Title
								</label>
								<input
									type="text"
									value={courseTitle}
									onChange={(e) => setCourseTitle(e.target.value)}
									placeholder="Enter course title (e.g., Machine Learning 101)"
									className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputBorder}`}
									autoFocus
								/>
							</div>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => {
										setShowModal(false);
										setCourseTitle("");
									}}
									className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${isDark
										? "border border-slate-700 text-slate-100 hover:bg-slate-800"
										: "border border-gray-300 text-gray-700 hover:bg-gray-50"
										}`}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									disabled={!courseTitle.trim() || isCreating}
								>
									{isCreating ? (
										<>
											<svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Creating...
										</>
									) : (
										"Create Course"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{courseToDelete && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
					<div
						className={`rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white"
							}`}
					>
						{/* Warning Icon */}
						<div className="flex justify-center mb-4">
							<div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
								</svg>
							</div>
						</div>

						{/* Title */}
						<h3 className={`text-xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
							Delete Course
						</h3>

						{/* Message */}
						<p className={`text-center mb-2 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
							Are you sure you want to delete
						</p>
						<p className={`text-center font-semibold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
							"{courseToDelete.title}"?
						</p>
						<p className={`text-center text-sm mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
							All documents and data related to this course will be permanently removed. This action cannot be undone.
						</p>

						{/* Buttons */}
						<div className="flex gap-3">
							<button
								onClick={handleCancelDelete}
								disabled={isDeleting}
								className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${isDark
									? "border border-slate-700 text-slate-100 hover:bg-slate-800"
									: "border border-gray-300 text-gray-700 hover:bg-gray-50"
									}`}
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmDelete}
								disabled={isDeleting}
								className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${isDeleting
									? "bg-gray-400 text-white cursor-not-allowed"
									: isDark
										? "border border-red-500/50 text-red-300 hover:bg-red-600 hover:text-white hover:border-red-600"
										: "border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
									}`}
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
