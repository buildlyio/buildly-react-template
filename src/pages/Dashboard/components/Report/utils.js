/**
 * Get release data for the budget cards
 * @param teamData
 * @param releases
 * @returns {*[]|*}
 */
import {
  FaRegCalendarCheck, FaCloudsmith, FaQuestionCircle, FaPlaneDeparture, FaHubspot,
} from 'react-icons/fa';

export const getReleaseBudgetData = (teamData, releases) => {
  if (releases) {
    return releases.map((release) => {
      const budgetDict = { ...release };
      const data = [];
      if (teamData) {
        if (release.name.toLowerCase()
          .includes('poc')) {
          teamData.forEach((team) => {
            if (team.role.toLowerCase() !== '') {
              data.push(
                {
                  title: team.role,
                  cost: +team.budget * +team.count,
                  count: team.count,
                },
              );
            }
          });
        } else if (release.name.toLowerCase()
          .includes('mvp')) {
          teamData.forEach((team) => {
            data.push(
              {
                title: team.role,
                cost: +team.budget * +team.count,
                count: team.count,
              },
            );
          });
        } else {
          teamData.forEach((team) => {
            const teamDict = {
              title: team.role,
              cost: +team.budget * +team.count,
              count: team.count,
            };
            if (release.features.length < 5 && team.count > 2) {
              teamDict.cost = +team.budget * (+team.count - 1);
              teamDict.count = +team.count - 1;
            }
            data.push(teamDict);
          });
        }
      }
      budgetDict.team = data;
      budgetDict.totalCost = data.map((x) => x.cost).reduce((prev, next) => prev + next);
      return budgetDict;
    });
  }
  return [];
};

export const addColorsAndIcons = (releaseData) => {
  if (!releaseData) {
    return null;
  }
  return releaseData.map((release, index) => {
    const releaseCopy = { ...release };
    const colors = ['#E0E0E0', '#F9943B', '#0C5594', '#152944'];
    let allColors = [...colors];

    const status = releaseCopy.release_status.toLowerCase();
    if (release.name.toLowerCase()
      .includes('poc')) {
      // add icons and color
      if (status === 'released') {
        releaseCopy.icon = FaRegCalendarCheck;
      } else if (status === 'in_progress') {
        releaseCopy.icon = FaHubspot;
      } else {
        releaseCopy.icon = FaQuestionCircle;
      }
    } else if (release.name.toLowerCase()
      .includes('mvp')) {
      // add icons and color
      if (status === 'released') {
        releaseCopy.icon = FaRegCalendarCheck;
      } else if (status === 'in_progress') {
        releaseCopy.icon = FaPlaneDeparture;
      } else {
        releaseCopy.icon = FaQuestionCircle;
      }
    } else {
      releaseCopy.icon = FaCloudsmith;
    }

    while (index > colors.length) {
      allColors += (colors);
    }

    releaseCopy.bgColor = colors[index];
    return releaseCopy;
  });
};
