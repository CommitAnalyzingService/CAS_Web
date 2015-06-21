angular.module('cg').controller('RepoController', function($scope, $state, $stateParams, socket, messageHandler, repoData) {
	$scope.metricValues = {
			ns: "# of modified subsystems",
			nd: "# of modified directories",
			nf: "# of modified files",
			entrophy: "Entropy (distribution)",
			la: "Lines added",
			ld: "Lines deleted",
			lt: "Total lines",
			ndev: "# of devs contributing",
			age: "Age from last change",
			nuc: "# of unique changes",
			exp: "Dev experience",
			rexp: "Recent dev experience",
			sexp: "Subsystem dev experience",	
	};

	$scope.metricDescriptionValues = {
			ns: "The number of subsystems touched by the commit. Commits modifying many subsystems are more likely to be risky\n\n",
			nd: "The number of directories touched by the commit. Commits modifying many directories are more likely to be risky\n\n",
			nf: "The number of files touched by the commit. Commits modifying many files are more likely to be risky\n\n",
			entrophy: "The distribution of the change across the different files. Commits where the change is evenly distributed across all files will have high entropy and vice versa. Commits with high entropy are more likely to be risky since a developer will have to recall and track large numbers of scattered changes across each file\n\n",
			la: "The number of lines of code added by the commit. The more lines of code added, the more risky a commit is\n\n",
			ld: "The number of lines of code deleted by the commit. The more lines of code deleted, the more risky a commit is\n\n",
			lt: "The number of lines of code in a file before the commit is made. For commits that touch multiple files, we use the average lines of code. Commits that touch large files are more risky\n\n",
			ndev: "The total number of developers that modified the touched files in the past. Commits that touch files with a high number of developers are more risky\n\n",
			age: "The average time interval between the last and the current change in days. For commits that touch multiple files, we measure the average of all files. The higher the age (i.e., more time elapsed), the more risky a commit is\n\n",
			nuc: "The number of unique changes to the files touched by the commit. Commits with more files are considered to be more risky\n\n",
			exp: "The number of commits made by the developer before the current commit. Commits made by less experienced developers are more risky\n\n",
			rexp: "The total experience of the developer in terms of commits, weighted by their age (more recent commit have a higher weight). Commits made by a developer with high relevant experience are less risky\n\n",
			sexp: "The number of commits the developer made in the past to the subsystems that are touched by the current commit. Commits made by a developer with high subsystem experience are less risky\n\n",	
	};

	$scope.metricKeys = Object.keys($scope.metricValues);
	
	$scope.metricGroups = [
		{
			name: 'Size',
			metricKeys: ['la', 'ld', 'lt']
		}, {
			name: 'History',
			metricKeys: ['ndev', 'age', 'nuc']
		}, {
			name: 'Diffusion',
			metricKeys: ['ns', 'nd', 'nf', 'entrophy']
		}, {
			name: 'Experience',
			metricKeys: ['exp', 'rexp', 'sexp']
		}
	];
	
	
	var registerMH = messageHandler.controllerRegister($scope);
	
	$scope.repo = repoData;
	$scope.showRepo = ($scope.repo.analysis_date != '');
	
	if(!$scope.showRepo) {
		registerMH({
			model: 'repository',
			verb: 'update',
			id: $scope.repo.id,
			callback: function(data) {
				if(data.hasOwnProperty('status')) {
					if($scope.repo.status != 'Analyzed' && data.status == 'Analyzed') {
						var current = $state.current;
			            var params = angular.copy($stateParams);
			            $state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
					}
				}
				$scope.repo = angular.extend($scope.repo, data);
			}
		});
	}
});