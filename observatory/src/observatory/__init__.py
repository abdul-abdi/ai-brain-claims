"""observatory — Active Context Hygiene for agent systems.

An immutable event log with importance and confidence as pure functions over the log.
The architecture that survived a 4-persona roundtable + 3-angle deep research.
"""

from observatory import confidence, importance
from observatory.log import Event, EventId, EventLog
from observatory.views import Delta, WorkingSet, compare, view

__all__ = [
    "Event",
    "EventId",
    "EventLog",
    "WorkingSet",
    "Delta",
    "view",
    "compare",
    "importance",
    "confidence",
]

__version__ = "0.1.0"
